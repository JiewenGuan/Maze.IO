import {
    Color,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
    Group,
    Mesh,
    MeshPhongMaterial,
    BoxGeometry,
} from "./three.js";
import { OrbitControls } from "./orbit.js";
import { FontLoader } from "./fontLoader.js";
import { MyController } from "./controller.js";
import { MazeGame, RubicsCubeGame } from "./games.js";

export class MyCam extends PerspectiveCamera {
    constructor(zdistance = 30) {
        super(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.position.z = zdistance;
    }
}

export class MyRenderer extends WebGLRenderer {
    constructor() {
        super();
        this.setPixelRatio(window.devicePixelRatio);
        this.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.domElement);
    }
}

export class MyScene extends Scene {
    constructor() {
        super();
        this.background = new Color(0x888888);

        let lights = [];
        lights[0] = new PointLight(0xffffff, 1, 0);
        lights[1] = new PointLight(0xffffff, 1, 0);
        lights[2] = new PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 0, 200);
        lights[1].position.set(100, 100, 200);
        lights[2].position.set(-100, -100, -200);

        this.utils = new Group();
        this.utils.add(lights[0], lights[1], lights[2]);
        this.add(this.utils);
    }
    reset() {
        this.clear();
        this.add(this.utils);
    }
}

export class Base {
    constructor() {
        window.base = this;
        this.camera = new MyCam();
        this.renderer = new MyRenderer();
        this.scene = new MyScene();
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.ctrl = new MyController(this);
        this.lastMove = new Date().getTime();

        window.addEventListener("resize", this.resize.bind(this), false);
        let textLoad = new FontLoader().load("font.json", this.loadFont.bind(this));

        this.loadGame();
    }

    loadFont(font){
        this.font = font;
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    reset() {
        this.scene.reset();
        this.ctrl.reset();
    }

    loadGame() {
        this.reset();
        switch (this.ctrl.data.Game.type) {
            case "Maze":
                this.game = new MazeGame(this);
                break;
            case "Rubics Cube":
                this.game = new RubicsCubeGame(this);
                break;
        }
    }
    animate() {
        let now = new Date().getTime();
        let delta = now - this.lastMove;
        if (delta > this.ctrl.data.delayMs) {
            this.lastMove = new Date().getTime();
        }
    }
    render() {
        requestAnimationFrame(this.render.bind(this));
        this.animate();
        this.renderer.render(this.scene, this.camera);
    }
}
