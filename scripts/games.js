import {Mesh,MeshPhongMaterial,BoxGeometry} from "./three.js";
class Game{
    constructor(base){
        this.scene = base.scene;
        this.controller = base.gui;
    }
    add(item){
        this.scene.add(item);
    }
    remove(item) {

        this.scene.remove(item);
    }
}

export class MazeGame extends Game{
    constructor(base){
        super(base);
        let geometry = new BoxGeometry();
        let material = new MeshPhongMaterial({ color: 0x00ff00 });
        let cube = new Mesh(geometry, material);
        this.add(cube);
    }
}
export class RubicsCubeGame extends Game{
    constructor(base){
        super(base);
        let geometry = new BoxGeometry();
        let material = new MeshPhongMaterial({ color: 0xff0000 });
        let cube = new Mesh(geometry, material);
        this.add(cube);

    }
}