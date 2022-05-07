import {
    Vector2,
    Vector3,
} from "./three.js";
import { Random } from "./utils.js";
export class Maze {
    constructor(config) {
        this.width = config.width;
        this.height = config.height;
        this.random = new Random(config.seed);
        this.walls = config.walls;

        this.start = [];
        for (let i = 0; i < config.numberOfStarts; i++) {
            this.start.push(this.makeVector(true))
        }
        this.goal = [];
        for(let i = 0; i < config.numberOfGoals; i++){
            this.goal.push(this.makeVector(false))
        }
        this.map = [];
    }
    makeMaze(){
        let fa = {}
        
    }
    makeVector(isStart){

    }
}
