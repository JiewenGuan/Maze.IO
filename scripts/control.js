import { Maze } from "./maze.js";
import { GUI } from "./lilgui.js";
import { Group } from "./three.js";

export class Control {
    constructor(scene) {
        window.ctrl = this;
        this.group = new Group();
        scene.add(this.group);

        this.gui = new GUI();
        this.obj = {
            Generate: function () {
                ctrl.Generate();
            },
            Width: 10,
            Height: 10,
            Seed:10
        };
        this.gui.add(this.obj, "Width",5,50,1); 
        this.gui.add(this.obj, "Height",5,50,1); 
        this.gui.add(this.obj, "Seed"); 
        this.gui.add(this.obj, "Generate"); 
        this.Generate()
    }
    Generate() {
        this.group.children = [];
        this.maze = new Maze(this.obj.Width,this.obj.Height,this.obj.Seed)
        this.maze.init();
        this.maze.generate();
        this.group.children = this.maze.toGroup().children;
    }
    
}
