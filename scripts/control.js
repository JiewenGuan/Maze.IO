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
                ctrl.resetButton.disable();
                ctrl.Generate();
            },
            Width: 10,
            Height: 10,
            Seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            Steps: 0,
            Algorithm: "BFS",
            Walls:"default",
            LoopFactor: 3,
            Start: function () {
                ctrl.Generate();
                ctrl.generateButton.disable();

                ctrl.Start();
            },
            Reset: function () {
                ctrl.resetButton.disable();
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
        config.add(this.obj, "delayMs", 1, 1000, 1).listen();
        config.add(this.obj, "Walls", ["default","loop","noWall"]);
        config.add(this.obj, "LoopFactor", 1, 10, 1);

        this.startAndGoal = config.addFolder("Start&Goal");
        this.startAndGoal.add(this.obj, "RandomStartAndGoal");
        this.startAndGoal
            .add(this.obj, "StartPositionX", 0, this.obj.Width - 1, 1)
            .listen();
            this.startAndGoal
            .add(this.obj, "StartPositionY", 0, this.obj.Height - 1, 1)
            .listen();
            this.startAndGoal
            .add(this.obj, "GoalPositionX", 0, this.obj.Width - 1, 1)
            .listen();
            this.startAndGoal
            .add(this.obj, "GoalPositionY", 0, this.obj.Height - 1, 1)
            .listen();
        this.generateButton = config.add(this.obj, "Generate");

        let statics = this.gui.addFolder("Statics");
        statics.add(this.obj, "Steps").listen().disable();

        let agent = this.gui.addFolder("Agent");
        agent.add(this.obj, "Algorithm", [
            "BFS",
            "DFS",
            "Astar(Manhattan)",
            "Astar(Euclidean)",
        ]);
        this.startButton = agent.add(this.obj, "Start");
        this.resetButton = agent.add(this.obj, "Reset").disable();

        this.Generate();
    }
    atStart(){
        
    }

    Start() {
        this.startButton.disable();
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
        this.startAndGoal.children[1].max(this.obj.Width - 1);
        this.startAndGoal.children[2].max(this.obj.Height - 1);
        this.startAndGoal.children[3].max(this.obj.Width - 1);
        this.startAndGoal.children[4].max(this.obj.Height - 1);
        this.group.children = [];
        if (this.agent) {
            this.agent.group.children = [];
            this.agent.clearTrace();
            this.agent = undefined;
        }

        this.maze = new Maze(this.obj.Width, this.obj.Height, this.obj.Seed);
        this.maze.init(this.obj.Walls);
        this.maze.generate(this.obj.RandomStartAndGoal, this.obj, this.obj.Walls, this.obj.LoopFactor);
        this.obj.StartPositionX = this.maze.start.x;
        this.obj.StartPositionY = this.maze.start.y;
        this.obj.GoalPositionX = this.maze.goal.x;
        this.obj.GoalPositionY = this.maze.goal.y;
        let mazegrp = this.maze.toGroup();
        mazegrp.name = "maze";
        this.group.add(mazegrp);
        this.agent = new Agent(this.maze, this.scene);
        this.problem = new PathFindProblem(this.maze);
        ctrl.startButton.enable();
    }
}
