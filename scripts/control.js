import { Maze } from "./maze.js";
import { GUI } from "./lilgui.js";
import { Group } from "./three.js";
import { Agent } from "./agent.js";
import { PathFindProblem } from "./problem.js";
export class Control {
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
            Seed: 10,
            Steps: 0,
            Algorithm: 'BFS',
            Start: function () {
                window.alert("Start");
            },
            Palse: function () {
                window.alert("Palse");
            },
            Reset: function () {
                window.alert("Reset");
            },
            StartPositionX:0,
            StartPositionY:0,
            GoalPositionX:1,
            GoalPositionY:1,
            RandomStartAndGoal:false,
        };

        let config = this.gui.addFolder("Config");
        config.add(this.obj, "Width", 7, 50, 1);
        config.add(this.obj, "Height", 7, 50, 1);
        config.add(this.obj, "Seed");
        config.add(this.obj, "RandomStartAndGoal");
        config.add(this.obj, "StartPositionX",0,50,1);
        config.add(this.obj, "StartPositionY",0,50,1);
        config.add(this.obj, "GoalPositionX",0,50,1);
        config.add(this.obj, "GoalPositionY",0,50,1);
        config.add(this.obj, "Generate");


        let statics = this.gui.addFolder("Statics");
        statics.add(this.obj, "Steps").listen().disable();

        let agent = this.gui.addFolder("Agent");
        agent.add( this.obj, 'Algorithm', [ 'BFS', 'DFS', 'Astar' ] )
        agent.add(this.obj, "Start");
        agent.add(this.obj, "Palse");
        agent.add(this.obj, "Reset");


        this.Generate();
    }
    Generate() {
        this.group.children = [];
        if(this.agent){
            this.agent.group.children = [];
            this.agent = undefined;
        }
        
        
        this.maze = new Maze(this.obj.Width, this.obj.Height, this.obj.Seed);
        this.maze.init();
        this.maze.generate(this.obj.RandomStartAndGoal,this.obj);
        this.group.children = this.maze.toGroup().children;
        this.agent = new Agent(this.maze,this.scene);
        this.problem = new PathFindProblem(this.maze);
        this.group.add(this.problem.toLines());
    }
}
