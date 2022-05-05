import { GUI } from "./lilgui.js";
export class MyController extends GUI {
    constructor() {
        super({ title: "Settings" });
        this.data = {
            Game:{
                type:"Maze",
                load: function () {
                    base.loadGame();
                },
                DelayMs: 10,
            },
            Maze: {
                width: 10,
                height: 10,
                seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            },
            
        };
        this.GameSelector = this.addFolder("Game")//.close();
        this.GameSelector.add(this.data.Game, "DelayMs", 1, 1000, 1);
        this.GameSelector.add(this.data.Game,"type",["Maze","Rubics Cube"]);
        this.GameSelector.add(this.data.Game,"load");

        //this.Game


    }
}