import { Vector2 } from "./three.js";
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
}
class MazeState extends State {
    constructor(position, maze, root=null) {
        super();
        this.root = root;
        this.position = position;
        let targets = maze.getNeighbors(position);
        this.actions = [];
        for (let target of targets) {
            if(this.root){
                if(this.root.position.equals(target)){
                    continue;
                }
            }
            this.actions.push(new this.constructor(target,maze,this));

        }

    }
    
}
