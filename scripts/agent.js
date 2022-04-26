import {
    Group,
    ConeGeometry,
    Mesh,
    MeshPhongMaterial,
    Line,
    BufferGeometry,
    LineBasicMaterial
} from "./three.js";
import { TextGeometry } from "./textGeometry.js";

export class Agent {
    constructor(maze, scene) {
        this.position = maze.start;
        this.maze = maze;
        this.group = new Group();
        this.trace = new Group();
        scene.add(this.group);
        scene.add(this.trace);
        this.update();
        window.agent = this;

        document.addEventListener("keydown", function (e) {
            switch (e.key) {
                case "w":
                case "ArrowUp":
                    agent.move(0);
                    break;
                case "s":
                case "ArrowDown":
                    agent.move(2);
                    break;
                case "a":
                case "ArrowLeft":
                    agent.move(3);
                    break;
                case "d":
                case "ArrowRight":
                    agent.move(1);
                    break;
                default:
                    console.log(e.key);
                    break;
            }
        });
    }
    update() {
        let buffer = this.group.children[0];
        if (buffer) {
            let pos = buffer.position.clone();
            let stepCount = ctrl.obj.Steps.toString();
            var txtGeo = new TextGeometry(stepCount, {
                font: font,
                size: 0.3,
                height: 0.1,
                curveSegments: 1,
                bevelEnabled: false
            });
            let material = new MeshPhongMaterial({ color: 0x000000 });
            let text = new Mesh(txtGeo, material);
            text.position.copy(pos);
            this.trace.add(text);
            ctrl.obj.Steps += 1;
        }
        this.group.remove(buffer);
        let geometry = new ConeGeometry(0.4, 2, 32, 1, false);
        let material = new MeshPhongMaterial({ color: 0x667b00 });
        let cone = new Mesh(geometry, material);
        cone.rotateX(-Math.PI / 2);
        cone.position.copy(this.maze.translateV3(this.position, 1));
        this.group.add(cone);
    }
    move(option) {
        let newpos = this.position.clone();
        switch (option) {
            case 0:
                newpos.y++;
                break;
            case 2:
                newpos.y--;
                break;
            case 3:
                newpos.x--;
                break;
            case 1:
                newpos.x++;
                break;
        }
        if (this.maze.isRoad(this.position, newpos)) {
            this.moveTo(newpos);
        }
    }
    moveTo(newpos) {
        if (!this.position.equals(newpos)) {
            this.position = newpos;
            this.update();
        }
    }
    clearTrace() {
        this.trace.children = [];
        ctrl.obj.Steps = 0;
    }
    showPath(goal,height = 2) {
        let current = goal;
        let points = [];
        while (current.root) {
            points.push(this.maze.translateV3(current.toVector(), height));
            current = current.root;
        }
        points.push(this.maze.translateV3(current.toVector(), height));
        let geometry = new BufferGeometry().setFromPoints(points);
        let material = new LineBasicMaterial({ color: 0xff0000 });
        let line = new Line(geometry, material);
        this.trace.add(line);
    }
}
