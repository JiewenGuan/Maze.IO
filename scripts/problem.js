import { Line, LineBasicMaterial, BufferGeometry, Group } from "./three.js";

export class PathFindProblem {
    constructor(maze) {
        this.maze = maze;
        this.pathRoot = new MazeState(maze.start, maze);
        window.problem = this;
    }

    getStartState() {
        return this.pathRoot;
    }

    isGoalState(state){
        return maze.goal.equals(state.position);
    }

    getActions(state) {
        return state.actions}

    getDistanceToGoal(state) {
        return state.position.distanceTo(this.maze.goal);
    }

    

    toLines() {
        let group = new Group();
        let vectorCues = this.unpackArr(this.pathRoot.toLines(), (vector) => {
            return this.maze.translateV3(vector, 0.5);
        });
        for (let cue of vectorCues) {
            let geometry = new BufferGeometry().setFromPoints(cue);
            let material = new LineBasicMaterial({ color: 0xff0000 });
            let line = new Line(geometry, material);
            group.add(line);
        }
        return group;
    }
    unpackArr(
        arr,
        postprocess = (vector) => {
            return vector;
        }
    ) {
        let buffer = [];
        let ret = [];
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                ret.push(...this.unpackArr(arr[i], postprocess));
            } else {
                buffer.push(postprocess(arr[i]));
            }
        }
        if (buffer.length > 0) {
            ret.push(buffer);
        }
        return ret;
    }
}
class MazeState {
    constructor(position, maze, root = null) {
        this.root = root;
        this.rootAction = null;
        this.position = position;
        let targets = maze.getNeighbors(position);
        this.actions = {};
        for (let [key, target] of Object.entries(targets)) {
            if (this.root) {
                if (this.root.position.equals(target)) {
                    this.rootAction = key;
                    continue;
                }
            }
            this.actions[key] = new this.constructor(target, maze, this);
        }
    }
    toLines(ret = []) {
        let acts = Object.values(this.actions);
        ret.push(this.position.clone());
        if (acts.length > 0) {
            acts[0].toLines(ret);
        }
        if (acts.length > 1) {
            let buffer = [];
            for (let i = 1; i < acts.length; i++) {
                buffer.push(acts[i].toLines([this.position.clone()]));
            }
            ret.push(buffer);
        }

        return ret;
    }
}
