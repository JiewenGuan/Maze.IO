import { sleep, PriorityQueue } from "./utils.js";

class Solver {
    constructor(problem, agent) {
        this.problem = problem;
        this.agent = agent;
    }
}

export class DepthFirst extends Solver {
    constructor(problem, agent) {
        
        super(problem, agent);
        this.current = this.problem.getStartState();
        this.visited = new Set();
        this.visited.add(this.current.toString());

        this.solve();
    }
    async solve() {
        while (!this.problem.isGoalState(this.current)) {
            let next = this.getnext(this.current);
            if (next) {
                this.current = next;
                this.agent.moveTo(this.current.toVector());
                this.agent.drawPath(this.current);
                await sleep(ctrl.obj.delayMs);
            } else {
                break;
            }
        }
        this.agent.showPath(this.current);
        ctrl.gui.children[2].children[2].enable();
        return this.current;
    }
    getnext(state) {
        for (let [key, action] of Object.entries(
            this.problem.getActions(state)
        )) {
            if (!this.visited.has(action.toString())) {
                this.visited.add(action.toString());
                return action;
            }
        }
        return this.getnext(state.root);
    }
}
export class BredthFirst extends Solver {
    constructor(problem, agent) {
        super(problem, agent);
        this.border = [problem.getStartState()];

        this.solve();
        //console.log(goal);
    }
    async solve() {
        let visited = new Set();
        visited.add(this.problem.getStartState().toString());
        while (this.border.length > 0) {
            let state = this.border.shift();
            this.agent.moveTo(state.toVector());
            this.agent.drawPath(state);
            await sleep(ctrl.obj.delayMs);
            if (this.problem.isGoalState(state)) {
                this.agent.showPath(state);
                ctrl.gui.children[2].children[2].enable();
                return state;
            }
            for (let [key, action] of Object.entries(
                this.problem.getActions(state)
            )) {
                if (!visited.has(action.toString())) {
                    this.border.push(action);
                    visited.add(action.toString());
                }
            }
        }
    }
}
export class Astar extends Solver {
    constructor(problem, agent) {
        super(problem, agent);
        this.que = new PriorityQueue();
        this.insert(this.problem.getStartState());
        this.solve();
    }
    async solve() {
        let visited = new Set();
        visited.add(this.problem.getStartState().toString());
        while (!this.que.isEmpty()) {
            let state = this.que.dequeue();
            this.agent.moveTo(state.toVector());
            this.agent.drawPath(state);
            await sleep(ctrl.obj.delayMs);
            if (this.problem.isGoalState(state)) {
                this.agent.showPath(state);
                ctrl.gui.children[2].children[2].enable();
                return state;
            }
            for (let [key, action] of Object.entries(
                this.problem.getActions(state)
            )) {
                if (!visited.has(action.toString())) {
                    this.insert(action);
                    visited.add(action.toString());
                }
            }
        }
    }
    insert(input){
        input.value = input.cost+this.problem.getDistanceToGoal(input);
        this.que.enqueue(input);
    }
}
