import { Line, LineBasicMaterial, BufferGeometry, Group } from "./three.js";
class Problem {
    constructor() {}
    GetStartState() {}
    IsGoalState(state) {}
    GetSuccessors(state) {}
    GetHeuristic(currentState) {}
}
class State {
    constructor() {
        //this.actions = actions;
    }
}

export class PathFindProblem extends Problem {
    constructor(maze) {
        super();
        this.maze = maze;
        this.pathRoot = new MazeState(maze.start, maze);
        window.problem = this;
    }
    toLines() {
        let group = new Group();
        let vectorCues = this.unpackArr(this.pathRoot.toLines(), (vector) => {return this.maze.translateV3(vector,0.5);});
        for (let cue of vectorCues) {
            let geometry = new BufferGeometry().setFromPoints(cue);
            let material = new LineBasicMaterial({ color: 0xff0000 });
            let line = new Line(geometry, material);
            group.add(line);
        }
        return group;
    }
    unpackArr(arr, postprocess = null) {
        let buffer = [];
        let ret = [];
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                ret.push(...this.unpackArr(arr[i], postprocess));
            } else {
                if (postprocess) {
                    buffer.push(postprocess(arr[i]));
                } else {
                    buffer.push(arr[i]);
                }
            }
        }
        if (buffer.length > 0) {
            ret.push(buffer);
        }
        return ret;
    }
}
class MazeState extends State {
    constructor(position, maze, root = null) {
        super();
        this.root = root;
        this.position = position;
        let targets = maze.getNeighbors(position);
        this.actions = [];
        for (let target of targets) {
            if (this.root) {
                if (this.root.position.equals(target)) {
                    continue;
                }
            }
            this.actions.push(new this.constructor(target, maze, this));
        }
    }
    toLines(ret = []) {
        ret.push(this.position.clone());
        if (this.actions.length > 0) {
            this.actions[0].toLines(ret);
        }
        if (this.actions.length > 1) {
            let buffer = [];
            for (let i = 1; i < this.actions.length; i++) {
                buffer.push(this.actions[i].toLines([this.position.clone()]));
            }
            ret.push(buffer);
        }

        return ret;
    }
}
