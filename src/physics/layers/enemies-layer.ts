import { PhysicalLayer } from "./physical-layer";
import { Enemy } from "../../model/enemy";
import { Constants } from "../../utils/constants";
import { Drawer } from "../../renderer/drawer";

export class EnemiesLayer extends PhysicalLayer {

    listEnemies: Enemy[];

    constructor(drawer: Drawer) {
        super(Constants.mazeWidth, Constants.mazeHeight, drawer);
        this.matrix.extend(1);
    }

    render() {
        for (let i = 0; i < this.listMovableObject.length; i++) {
            this.drawer.drawPhysicalObject(this.listMovableObject[i]);    
        }
    }
}