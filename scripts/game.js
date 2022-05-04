import {
    Color,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
    Mesh,
    MeshPhongMaterial,
    BoxGeometry,
} from "./three.js";
import { OrbitControls } from "./orbit.js";
import { FontLoader } from "./fontLoader.js";
import { GUI } from "./lilgui.js";
import { sleep } from "./utils.js";
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

        this.lights = [];
        this.lights[0] = new PointLight(0xffffff, 1, 0);
        this.lights[1] = new PointLight(0xffffff, 1, 0);
        this.lights[2] = new PointLight(0xffffff, 1, 0);

        this.lights[0].position.set(0, 0, 200);
        this.lights[1].position.set(100, 100, 200);
        this.lights[2].position.set(-100, -100, -200);

        this.add(this.lights[0]);
        this.add(this.lights[1]);
        this.add(this.lights[2]);
    }
}

export class MyController extends GUI {
    constructor(game) {
        super({ title: "Settings" });
        this.game = game;
        this.data = {
            //maze
            Width: 10,
            Height: 10,
            Seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            delayMs: 10,
            direction: 0,
        };
        this.add(this.data, "delayMs", 1, 1000, 1);

        this.config = this.add(this.data, "direction", 0, 5, 1);
    }
}

export class Game {
    constructor() {
        window.game = this;
        this.camera = new MyCam();
        this.renderer = new MyRenderer();
        this.scene = new MyScene();
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.gui = new MyController(this);
        this.lastMove = new Date().getTime();

        window.addEventListener(
            "resize",
            function () {
                game.camera.aspect = window.innerWidth / window.innerHeight;
                game.camera.updateProjectionMatrix();

                game.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false
        );
        let textLoad = new FontLoader().load("font.json", function (font) {
            game.font = font;
        });

        //test cube
        let geometry = new BoxGeometry(1, 1, 1);
        let material = new MeshPhongMaterial({ color: 0x00ff00 });
        this.cube = new Mesh(geometry, material);
        this.scene.add(this.cube);
    }
    animate() {
        let now = new Date().getTime();
        let delta = now - this.lastMove;
        if (delta > this.gui.data.delayMs) {
            this.lastMove = new Date().getTime();
            switch (this.gui.data.direction) {
                case 0:
                    break;
                case 1:
                    this.cube.position.y += 0.1;
                    break;
                case 2:
                    this.cube.position.x += 0.1;
                    break;
                case 3:
                    this.cube.position.y -= 0.1;
                    break;
                case 4:
                    this.cube.position.x -= 0.1;
                    break;
            }
        }
    }
    render() {
        requestAnimationFrame(game.render);
        game.animate();
        game.renderer.render(game.scene, game.camera);
    }
}
