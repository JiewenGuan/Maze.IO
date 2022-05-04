import {
    BoxGeometry,
    Group,
    Mesh,
    MeshPhongMaterial,
    Vector2,
    Vector3,
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
    }
    init(walls) {
        this.random = new Random(this.seed);
        this.fa = {};
        this.map = [];

        switch (walls) {
            case "loop":
            case "default":
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
                break;
            case "noWall":
                for (let i = 0; i < this.height * 2 + 1; i++) {
                    let buffer = [];
                    for (let j = 0; j < this.width * 2 + 1; j++) {
                        if (
                            i == 0 ||
                            j == 0 ||
                            i == this.height * 2 ||
                            j == this.width * 2
                        ) {
                            buffer.push(1);
                        } else {
                            buffer.push(0);
                        }
                    }
                    this.map.push(buffer);
                }
                break;
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
    generate(randomSG = false, obj = null, walls = null,loopFactor = 10) {
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
        if (randomSG) {
            while (
                this.manhattanDistance() <
                Math.floor((this.width + this.height) * 0.7)
            ) {
                this.start.x = this.random.getint(0, this.width - 1);
                this.start.y = this.random.getint(0, this.height - 1);
                this.goal.x = this.random.getint(0, this.width - 1);
                this.goal.y = this.random.getint(0, this.height - 1);
            }
        } else {
            if (obj.StartPositionX > obj.Width - 1) {
                this.start.x = obj.Width - 1;
            } else {
                this.start.x = obj.StartPositionX;
            }
            if (obj.StartPositionY > obj.Height - 1) {
                this.start.y = obj.Height - 1;
            } else {
                this.start.y = obj.StartPositionY;
            }
            if (obj.GoalPositionX > obj.Width - 1) {
                this.goal.x = obj.Width - 1;
            } else {
                this.goal.x = obj.GoalPositionX;
            }
            if (obj.GoalPositionY > obj.Height - 1) {
                this.goal.y = obj.Height - 1;
            } else {
                this.goal.y = obj.GoalPositionY;
            }
        }
        if (walls === "loop") {
            for (let i = 1; i < this.height * 2; i += 2) {
                for (let j = 2; j < this.width * 2; j += 2) {
                    if (!this.random.getint(0, loopFactor)) {
                        this.map[i][j] = 0;
                    }
                }
            }
            for (let i = 2; i < this.height * 2; i += 2) {
                for (let j = 1; j < this.width * 2; j += 2) {
                    if (!this.random.getint(0, loopFactor)) {
                        this.map[i][j] = 0;
                    }
                }
            }
        }
    }
    manhattanDistance() {
        let ret = this.start.manhattanDistanceTo(this.goal);
        return ret;
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
                let pos = new Vector3()
                    .copy(
                        this.timeDist(new Vector2(j, i)).sub(
                            new Vector2(
                                this.totalWidth / 2,
                                this.totalHeight / 2
                            )
                        )
                    )
                    .setZ(0);

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
                mesh.position.copy(pos);
                group.add(mesh);
            }
        }

        let material = new MeshPhongMaterial({ color: 0x00ff00 });
        let geometry = new SphereGeometry(0.5);
        let startmesh = new Mesh(geometry, material);
        startmesh.name = "start";
        startmesh.position.copy(this.translateV3(this.start));
        group.add(startmesh);

        let material2 = new MeshPhongMaterial({ color: 0xff0000 });
        let geometry2 = new SphereGeometry(0.5);
        let goalmesh = new Mesh(geometry2, material2);
        goalmesh.name = "goal";
        goalmesh.position.copy(this.translateV3(this.goal));
        group.add(goalmesh);
        return group;
    }
    timeDist(input) {
        return input.multiplyScalar((this.cellWidth + this.wallthickness) / 2);
    }
    timeCoord(input) {
        return input.clone().multiplyScalar(2).addScalar(1);
    }

    translateV2(input) {
        return this.timeDist(this.timeCoord(input)).sub(
            new Vector2(this.totalWidth / 2, this.totalHeight / 2)
        );
    }
    translateV3(input, height = 0) {
        let ret = this.translateV2(input);
        return new Vector3(ret.x, ret.y, height);
    }
    isRoad(position, newpos) {
        let buffer = this.timeCoord(position)
            .add(this.timeCoord(newpos))
            .divideScalar(2);
        if (this.getCell(buffer) == 0) {
            return true;
        }
        return false;
    }
    getCell(input) {
        return this.map[input.y][input.x];
    }
    getNeighbors(input) {
        let target = [
            input.clone().add(new Vector2(0, 1)),
            input.clone().add(new Vector2(1, 0)),
            input.clone().add(new Vector2(0, -1)),
            input.clone().add(new Vector2(-1, 0)),
        ];
        let ret = {};
        for (let i = 0; i < target.length; i++) {
            if (this.isRoad(input, target[i])) {
                ret[i] = target[i];
            }
        }
        return ret;
    }
}
