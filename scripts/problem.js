import { Vector2 } from "./three.js";

export class PathFindProblem {
    constructor(maze) {
        this.maze = maze;
        this.pathRoot = new MazeState(maze.start);
        window.problem = this;
        window.Vector2 = Vector2;
    }

    getStartState() {
        return this.pathRoot;
    }

    isGoalState(state) {
        return maze.goal.equals(state);
    }

    getActions(state) {
        let ret = {};

        for(let [key,action] of Object.entries(maze.getNeighbors(state))) {
            ret[key]=new MazeState(action)
        }
        return ret;
    }

    getDistanceToGoal(state) {
        return state.distanceTo(this.maze.goal);
    }
}
class MazeState extends Vector2 {
    constructor(position) {
        super();
        this.copy(position);
        this.value = Number.MAX_VALUE;
    }
    setValue(input) {
        if(input<this.value) {
            this.value = input;
            return true;
        }
        return false;
    }
}
