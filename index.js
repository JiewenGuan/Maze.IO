import {
    Color,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
} from "three";

import { OrbitControls } from "./scripts/orbit.js";
import { Control } from "./scripts/control.js";

let scene = new Scene();

let control = new Control(scene);

scene.background = new Color(0x888888);

let camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.z = 30;

let renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let orbit = new OrbitControls(camera, renderer.domElement);

let lights = [];
lights[0] = new PointLight(0xffffff, 1, 0);
lights[1] = new PointLight(0xffffff, 1, 0);
lights[2] = new PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 0, 200);
lights[1].position.set(100, 100, 200);
lights[2].position.set(-100, -100, -200);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

function render() {
    requestAnimationFrame(render);

    //group.rotation.x += 0.005;
    //group.rotation.y += 0.005;

    renderer.render(scene, camera);
}

window.addEventListener(
    "resize",
    function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);

render();
