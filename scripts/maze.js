import {
    BoxGeometry,
    Group,
    Mesh,
    MeshPhongMaterial,
    Vector2,
    SphereGeometry,
} from "./three.js";
import { Random } from "./utils.js";

export class Maze {
    constructor(width = 10, height = 10, seed = 10) {
        window.maze = this;
        this.width = width;
        this.height = height;
        this.seed = seed;
        this.cellWidth = 1.0;
        this.wallthickness = 0.1;
        this.wallHeight = 1;
        this.cellHeight = 0.1;
        this.totalWidth = (this.wallthickness + this.cellWidth) * this.width;
        this.totalHeight = (this.wallthickness + this.cellWidth) * this.height;
        this.start = new Vector2();
        this.goal = new Vector2();
        this.init();
    }
    init() {
        this.random = new Random(this.seed);
        this.fa = {};
        this.map = [];
        for (let i = 0; i < this.height * 2 + 1; i++) {
            let buffer = [];
            for (let j = 0; j < this.width * 2 + 1; j++) {
                buffer.push(1);
            }
            this.map.push(buffer);
        }
        for (let i = 1; i < this.height * 2; i++) {
            if (i % 2 == 1) {
                for (let j = 1; j < this.width * 2; j++) {
                    if (j % 2 == 1) {
                        this.map[i][j] = 0;
                        this.fa[[i, j]] = [i, j];
                    }
                }
            }
        }
    }
    arround(e) {
        let ret = [];
        if (e[0] % 2 == 1) {
            ret = [
                [e[0], e[1] - 1],
                [e[0], e[1] + 1],
            ];
        } else {
            ret = [
                [e[0] - 1, e[1]],
                [e[0] + 1, e[1]],
            ];
        }
        return ret;
    }
    find(p1) {
        if (p1 != this.fa[p1]) {
            this.fa[p1] = this.find(this.fa[p1]);
        }
        return this.fa[p1];
    }
    union(p1, p2) {
        let root1 = this.find(p1);
        let root2 = this.find(p2);
        this.fa[root1] = root2;
    }
    generate() {
        let cue = [];
        for (let i = 1; i < this.height * 2; i += 2) {
            for (let j = 2; j < this.width * 2; j += 2) {
                cue.push([i, j]);
            }
        }
        for (let i = 2; i < this.height * 2; i += 2) {
            for (let j = 1; j < this.width * 2; j += 2) {
                cue.push([i, j]);
            }
        }
        while (cue.length > 0) {
            let index = this.random.getint(0, cue.length - 1);
            let e = cue.splice(index, 1)[0];
            let ard = this.arround(e);
            if (this.find(ard[0]) != this.find(ard[1])) {
                this.union(ard[0], ard[1]);
                this.map[e[0]][e[1]] = 0;
            }
        }
        while (this.manhattanDistance() < (this.width + this.height)*0.75) {
            this.start.x = this.random.getint(0, this.width - 1);
            this.start.y = this.random.getint(0, this.height - 1);
            this.goal.x = this.random.getint(0, this.width - 1);
            this.goal.y = this.random.getint(0, this.height - 1);
        }
    }
    manhattanDistance() {
        return this.start.manhattanDistanceTo(this.goal);
    }
    print() {
        for (let i = 0; i < this.map.length; i++) {
            let str = "";
            for (let j = 0; j < this.map[i].length; j++) {
                str += this.map[i][j];
            }
            console.log(str);
        }
    }

    toGroup() {
        let group = new Group();
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let namestr = `X${i}Y${j}`;
                let cubeX = this.wallthickness;
                let cubeY = this.wallthickness;
                let cubeZ = this.cellHeight;

                let posX = this.tdist(j) - this.totalWidth / 2;
                let posY = this.tdist(i) - this.totalHeight / 2;
                let color = 0;

                if (this.map[i][j] == 0) {
                    color = 0xffffff;
                    namestr += "Cell";
                } else if (this.map[i][j] == 1) {
                    color = 0x000000;
                    cubeZ = this.wallHeight;
                    namestr += "Wall";
                }

                if (i % 2 == 1) {
                    cubeY = this.cubewidth;
                }
                if (j % 2 == 1) {
                    cubeX = this.cellWidth;
                }

                let material = new MeshPhongMaterial({ color: color });
                let geometry = new BoxGeometry(cubeX, cubeY, cubeZ);
                let mesh = new Mesh(geometry, material);
                mesh.name = namestr;
                mesh.position.set(posX, posY, 0);
                group.add(mesh);
            }
        }
        //add start and goal
        //get coordinates
        let startX =
            this.tdist(this.tCorrd(this.start.x)) - this.totalWidth / 2;

        let startY =
            this.tdist(this.tCorrd(this.start.y)) - this.totalHeight / 2;
        let material = new MeshPhongMaterial({ color: 0x00ff00 });
        let geometry = new SphereGeometry(0.5);
        let startmesh = new Mesh(geometry, material);
        startmesh.name = "start";
        startmesh.position.set(startX, startY, 0);
        group.add(startmesh);

        let goalX = this.tdist(this.tCorrd(this.goal.x)) - this.totalWidth / 2;
        let goalY = this.tdist(this.tCorrd(this.goal.y)) - this.totalHeight / 2;
        let material2 = new MeshPhongMaterial({ color: 0xff0000 });
        let geometry2 = new SphereGeometry(0.5);
        let goalmesh = new Mesh(geometry2, material2);
        goalmesh.name = "goal";
        goalmesh.position.set(goalX, goalY, 0);
        group.add(goalmesh);
        return group;
    }
    tCorrd(input) {
        return input * 2 + 1;
    }
    tdist(input) {
        return ((this.cellWidth + this.wallthickness) / 2) * input;
    }
}
