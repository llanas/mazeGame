import Player from "../../model/player";
import { PhysicalLayer } from "./physical-layer";
import { Constants } from "../../utils/constants";
import { Drawer } from "../../renderer/drawer";

export class PlayerLayer extends PhysicalLayer {

    player: Player;

    constructor(player: Player, drawer: Drawer) {
        super(Constants.mazeWidth, Constants.mazeHeight, drawer);
        this.matrix.extend(1);
        this.player = player;
        this.add(player);
    }

    render() {
        for (let i = 0; i < this.listMovableObject.length; i++) {
            this.drawer.drawPhysicalObject(this.listMovableObject[i]);    
        }
    }
}