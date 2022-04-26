import { sleep } from "./utils.js";


class Solver {
    constructor(problem, agent) {
        this.problem = problem;
        this.agent = agent;
        this.isrunning = false;
    }
}

export class DepthFirst extends Solver {
    constructor(problem, agent) {
        super(problem, agent);
        this.solve();
    }
    solve() {
        alert("DepthFirst");
    }
}
export class BredthFirst extends Solver {
    constructor(problem, agent) {
        super(problem, agent);
        this.border = [problem.getStartState()];
        this.getGoal();
        //console.log(goal);
    }
    async getGoal() {
        let visited = new Set();
        visited.add(this.problem.getStartState().toString());
        while (this.border.length > 0) {
            let state = this.border.shift();
            this.agent.moveTo(state.toVector())
            await sleep(ctrl.obj.delayMs);
            if (this.problem.isGoalState(state)) {
                this.agent.showPath(state);
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
    insert(state) {
        let i = 0;
    }
}
export class Astar extends Solver {
    constructor(problem, agent) {
        super(problem, agent);
        this.solve();
    }
    solve() {
        alert("Astar");
    }
}
