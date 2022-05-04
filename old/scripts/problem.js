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
        for (let [key, action] of Object.entries(maze.getNeighbors(state))) {
            ret[key] = new MazeState(action, state);
        }
        return ret;
    }

    getDistanceToGoal(state) {
        return state.distanceTo(this.maze.goal);

    }

    getManhattanDistanceToGoal(state) {
        return state.manhattanDistanceTo(this.maze.goal);
    }
}
class MazeState extends Vector2 {
    constructor(position, root = null) {
        super();
        this.root = root;
        this.copy(position);
        this.value = 0;
        if(root){
        this.cost = root.cost+1;
        }else{
            this.cost = 1;
        }
    }
    clone() {
        return new MazeState(
            new Vector2(this.x, this.y),
            this.root,
            this.value
        );
    }
    equals(other) {
        if (other) {
            return this.x == other.x && this.y == other.y;
        }
        return false;
    }
    toString() {
        return `${this.x}, ${this.y}`;
    }
    toVector(){
        return new Vector2(this.x, this.y);
    }
    
}
