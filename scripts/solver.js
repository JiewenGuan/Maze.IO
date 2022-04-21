class Solver{
    constructor(problem,agent){
        this.problem = problem;
        this.agent = agent;
    }
}

export class DepthFirst extends Solver{
    constructor(problem,agent){
        super(problem,agent);
        this.solve();
    }
    solve(){
        alert("DepthFirst")
    }
}
export class BredthFirst extends Solver{
    constructor(problem,agent){
        super(problem,agent);
        this.solve();
    }
    solve(){
        alert("BredthFirst")
    }
}
export class Astar extends Solver{
    constructor(problem,agent){
        super(problem,agent);
        this.solve();
    }
    solve(){
        alert("Astar")
    }
}