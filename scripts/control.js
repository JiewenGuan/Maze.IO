import { Maze } from "./maze.js";
import { GUI } from "./lilgui.js";
import { Group } from "./three.js";
import { Agent } from "./agent.js";
import { PathFindProblem } from "./problem.js";
import { BredthFirst, DepthFirst, Astar } from "./solver.js";
export class Control {
    solver;
    constructor(scene) {
        window.ctrl = this;
        this.group = new Group();
        this.scene = scene;
        this.scene.add(this.group);

        this.gui = new GUI();
        this.obj = {
            Generate: function () {
                ctrl.gui.children[2].children[2].disable();
                ctrl.Generate();
            },
            Width: 10,
            Height: 10,
            Seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            Steps: 0,
            Algorithm: "BFS",
            Start: function () {
                ctrl.Generate();
                ctrl.gui.children[0].children[7].disable();

                ctrl.Start();
            },
            Reset: function () {
                ctrl.gui.children[2].children[2].disable();
                ctrl.Generate();
            },

            StartPositionX: 0,
            StartPositionY: 0,
            GoalPositionX: 1,
            GoalPositionY: 1,
            RandomStartAndGoal: true,
            stepHeight: 0.5,
            pathHeight: 0.5,
            delayMs: 100,
        };

        let config = this.gui.addFolder("Config");
        config.add(this.obj, "Width", 7, 50, 1);
        config.add(this.obj, "Height", 7, 50, 1);
        config.add(this.obj, "Seed");
        config.add(this.obj, "stepHeight");
        config.add(this.obj, "pathHeight");
        config.add(this.obj, "delayMs", 1, 1000, 1).listen();
        let startAndGoal = config.addFolder("Start&Goal");
        startAndGoal.add(this.obj, "RandomStartAndGoal");
        startAndGoal
            .add(this.obj, "StartPositionX", 0, this.obj.Width - 1, 1)
            .listen();
        startAndGoal
            .add(this.obj, "StartPositionY", 0, this.obj.Height - 1, 1)
            .listen();
        startAndGoal
            .add(this.obj, "GoalPositionX", 0, this.obj.Width - 1, 1)
            .listen();
        startAndGoal
            .add(this.obj, "GoalPositionY", 0, this.obj.Height - 1, 1)
            .listen();
        config.add(this.obj, "Generate");

        let statics = this.gui.addFolder("Statics");
        statics.add(this.obj, "Steps").listen().disable();

        let agent = this.gui.addFolder("Agent");
        agent.add(this.obj, "Algorithm", [
            "BFS",
            "DFS",
            "Astar(Manhattan)",
            "Astar(Euclidean)",
        ]);
        agent.add(this.obj, "Start");
        agent.add(this.obj, "Reset").disable();

        this.Generate();
    }
    Start() {
        this.gui.children[2].children[1].disable();
        switch (this.obj.Algorithm) {
            case "BFS":
                this.solver = new BredthFirst(this.problem, this.agent);
                break;
            case "DFS":
                this.solver = new DepthFirst(this.problem, this.agent);
                break;
            case "Astar(Manhattan)":
                this.solver = new Astar(this.problem, this.agent, true);
                break;
            case "Astar(Euclidean)":
                this.solver = new Astar(this.problem, this.agent);
                break;
        }
    }

    Generate() {
        ctrl.gui.children[0].children[6].children[1].max(this.obj.Width - 1);
        ctrl.gui.children[0].children[6].children[2].max(this.obj.Height - 1);
        ctrl.gui.children[0].children[6].children[3].max(this.obj.Width - 1);
        ctrl.gui.children[0].children[6].children[4].max(this.obj.Height - 1);
        this.group.children = [];
        if (this.agent) {
            this.agent.group.children = [];
            this.agent.clearTrace();
            this.agent = undefined;
        }

        this.maze = new Maze(this.obj.Width, this.obj.Height, this.obj.Seed);
        this.maze.init();
        this.maze.generate(this.obj.RandomStartAndGoal, this.obj);
        this.obj.StartPositionX = this.maze.start.x;
        this.obj.StartPositionY = this.maze.start.y;
        this.obj.GoalPositionX = this.maze.goal.x;
        this.obj.GoalPositionY = this.maze.goal.y;
        let mazegrp = this.maze.toGroup();
        mazegrp.name = "maze";
        this.group.add(mazegrp);
        this.agent = new Agent(this.maze, this.scene);
        this.problem = new PathFindProblem(this.maze);
        ctrl.gui.children[2].children[1].enable();
    }
}
