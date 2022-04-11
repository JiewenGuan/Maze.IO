import { Maze } from "./maze.js";
import { GUI } from "/scripts/lilgui.js";
import { Group } from "three";

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
        };
        this.gui.add(this.obj, "Width",5,50,1); 
        this.gui.add(this.obj, "Height",5,50,1); 
        this.gui.add(this.obj, "Generate"); 
        this.Generate()
    }
    Generate() {
        this.group.children = [];
        this.maze = new Maze(this.obj.Width,this.obj.Height)
        this.maze.init();
        this.maze.generate();
        this.group.add(this.maze.toGroup());
    }
    
}
