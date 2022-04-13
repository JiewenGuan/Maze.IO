import { Group, ConeGeometry, Mesh, MeshPhongMaterial } from "./three.js";
export class Agent {
    constructor(maze, scene) {
        this.position = maze.start;
        this.maze = maze;
        this.group = new Group();
        this.trace = new Group();
        scene.add(this.group);
        scene.add(this.trace);
        this.update();
    }
    update() {
        let buffer = this.group.children[0];
        if (buffer) {
            buffer.position.z=0
            buffer.rotateX(Math.PI);
            this.trace.add(buffer);
        }
        this.group.remove(buffer);
        let geometry = new ConeGeometry(0.4, 2, 32, 1, false);
        let material = new MeshPhongMaterial({ color: 0x667b00 });
        let cone = new Mesh(geometry, material);
        cone.rotateX(-Math.PI / 2);
        cone.position.copy(this.maze.translateV3(this.position, 1));
        this.group.add(cone);
        ctrl.obj.Steps = this.trace.children.length
    }
    move(option) {
        let newpos = this.position.clone();
        switch (option) {
            case "up":
                newpos.y++;
                break;
            case "down":
                newpos.y--;
                break;
            case "left":
                newpos.x--;
                break;
            case "right":
                newpos.x++;
                break;
        }
        if (this.maze.isRoad(this.position, newpos)) {
            this.position = newpos;
            this.update();
        }
    }
}
