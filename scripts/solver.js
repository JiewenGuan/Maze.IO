class Solver{
    constructor(problem,agent){
        this.problem = problem;
        this.agent = agent;
        this.isrunning = false;
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
        this.border = [];
        this.pathTree = {};
        this.solve();
    }
    solve(){
        
    }
    insert(state){
        let i = 0;
        
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