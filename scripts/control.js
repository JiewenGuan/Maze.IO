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
                ctrl.Generate();
            },
            Width: 10,
            Height: 10,
            Seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            Steps: 0,
            Algorithm: "BFS",
            Start: function () {
                ctrl.Start();
            },
            Reset: function () {
                ctrl.Generate()
            },
            StartPositionX: 0,
            StartPositionY: 0,
            GoalPositionX: 1,
            GoalPositionY: 1,
            RandomStartAndGoal: true,
        };

        let config = this.gui.addFolder("Config");
        config.add(this.obj, "Width", 7, 50, 1);
        config.add(this.obj, "Height", 7, 50, 1);
        config.add(this.obj, "Seed");
        let startAndGoal = config.addFolder("Start&Goal");
        startAndGoal.add(this.obj, "RandomStartAndGoal");
        startAndGoal.add(this.obj, "StartPositionX", 0, 50, 1).listen();
        startAndGoal.add(this.obj, "StartPositionY", 0, 50, 1).listen();
        startAndGoal.add(this.obj, "GoalPositionX", 0, 50, 1).listen();
        startAndGoal.add(this.obj, "GoalPositionY", 0, 50, 1).listen();
        config.add(this.obj, "Generate");
        
        let statics = this.gui.addFolder("Statics");
        statics.add(this.obj, "Steps").listen().disable();

        let agent = this.gui.addFolder("Agent");
        agent.add(this.obj, "Algorithm", ["BFS", "DFS", "Astar"]);
        agent.add(this.obj, "Start");
        agent.add(this.obj, "Reset");

        this.Generate();
    }
    Start() {
        this.agent.clearTrace()
        switch (this.obj.Algorithm) {
            case "BFS":
                this.solver = new BredthFirst(this.problem, this.agent);
                break;
            case "DFS":
                this.solver = new DepthFirst(this.problem, this.agent);
                break;
            case "Astar":
                this.solver = new Astar(this.problem, this.agent);
                break;
        }
    }
    
    Generate() {
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
        //this.group.add(this.problem.toLines());
    }
}
