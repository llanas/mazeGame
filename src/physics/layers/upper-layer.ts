import { PhysicalLayer } from "./physical-layer";
import { Constants } from "../../utils/constants";
import { Drawer } from "../../renderer/drawer";
import Player from "../../model/player";
import { ObjectRenderer } from "../../renderer/object-renderer";
import { MazeGrid } from "../../model/maze-grid";

export class UpperLayer extends PhysicalLayer {

    player: Player;
    mazeGrid: MazeGrid;

    constructor(player: Player, _mazeGrid: MazeGrid) {
        super(Constants.mazeWidth, Constants.mazeHeight, new Drawer(Constants.upperLayerId));
        this.player = player;
        this.mazeGrid = _mazeGrid;
    }

    render() {
        let cloudRenderer = ObjectRenderer.cloud;
        for (let x = 0; x < this.mazeGrid.listSquares.length; x++) {
            let square = this.mazeGrid.listSquares[x]
            /* if(player.listVisibleSquares.indexOf(square) != -1) {
                color.opacity = 0;
            } else  */if(square.hasBeenPassed) {
                cloudRenderer.color.opacity = .9;
            } else {
                cloudRenderer.color.opacity = 1;
            }
            this.drawer.drawPhysicalObject(this.mazeGrid.listSquares[x], cloudRenderer);
        }
        this.drawer.drawPlayerVisionCircle(this.player);
    }
}