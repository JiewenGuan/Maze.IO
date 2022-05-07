import {Maze} from './models.js';
class Game {
    constructor(base) {
        this.scene = base.scene;
        this.controller = base.ctrl;
    }
    addItem(item) {
        return this.scene.add(item);
    }
    addCtrl(t, e, s, n, r) {
        return this.controller.add(t, e, s, n, r);
    }
    addFolder(t) {
        return this.controller.addFolder(t);
    }
}

export class MazeGame extends Game {
    constructor(base) {
        super(base);
        document.getElementById("MESSAGE").innerHTML = "Move with wasd or arrow keys";
        this.buildController();
        this.generate();
    }
    generate() {
        this.maze = new Maze(this.data.config);

    }
    start(){
        alert("start")
    }
    stop() {
        alert("stop")
    }
    reset(){
        alert("reset")
    }
    buildController() {
        this.data = {
            config: {
                width: 10,
                height: 10,
                seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                walls: "default",
                loopFactor: 3,
                randomSG: true,
                numberOfStarts: 1,
                numberOfGoals: 1,
            },
            statics: {
                steps: 0,
                pathLength: 0,
            },
            methods: {
                generate: this.generate.bind(this),
                start: this.start.bind(this),
                stop: this.stop.bind(this),
                reset: this.reset.bind(this),}
        };
        this.config = this.addFolder("Config");
        this.config.add(this.data.config, "width", 5, 50, 1).name("Width");
        this.config.add(this.data.config, "height", 5, 50, 1).name("Height");
        this.config.add(this.data.config, "seed").name("Random Seed");
        this.config
            .add(this.data.config, "walls", ["default", "loop", "noWall"])
            .name("Walls");
        this.config
            .add(this.data.config, "loopFactor", 1, 10, 1)
            .name("Loop Factor");
        this.config
            .add(this.data.config, "randomSG")
            .name("Random Start and Goal");
        this.config
            .add(this.data.config, "numberOfStarts", 1, 5, 1)
            .name("Number of Starts");
        this.config
            .add(this.data.config, "numberOfGoals", 1, 5, 1)
            .name("Number of Goals");
            this.config.add(this.data.methods, "generate");

        this.statics = this.addFolder("Statics");
        this.statics.add(this.data.statics, "steps").name("Steps").listen();
        this.statics.add(this.data.statics, "pathLength").name("Path Length").listen();
        this.control = this.addFolder("Control");
        this.control.add(this.data.methods, "start");
        this.control.add(this.data.methods, "stop");
        this.control.add(this.data.methods, "reset");

    }
}
export class RubicsCubeGame extends Game {
    constructor(base) {
        super(base);
        document.getElementById("MESSAGE").innerHTML = "Rubics Cube is under construction";
    }
}
