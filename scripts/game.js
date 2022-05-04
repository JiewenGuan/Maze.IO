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

        //test cube
        let geometry = new BoxGeometry(1, 1, 1);
        let material = new MeshPhongMaterial({ color: 0x00ff00 });
        let cube = new Mesh(geometry, material);
        this.add(cube);
    }
}

export class Game {
    constructor() {
        window.game = this;
        this.camera = new MyCam();
        this.renderer = new MyRenderer();
        this.scene = new MyScene();
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.gui = new GUI({ title: "Config" });

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
    }
    render() {
        requestAnimationFrame(game.render);

        game.renderer.render(game.scene, game.camera);
    }
}
