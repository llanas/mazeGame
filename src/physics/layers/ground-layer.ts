import { PhysicalLayer } from "./physical-layer";
import { MazeGrid } from "../../model/maze-grid";
import { Drawer } from "../../renderer/drawer";
import { Constants } from "../../utils/constants";
import { mazeGrid } from "../..";

export class GroundLayer extends PhysicalLayer {

    mazeGrid: MazeGrid;

    constructor(_gridWidth: number, _gridHeight: number) {
        super(_gridWidth, _gridHeight, new Drawer(Constants.groundLayerId));
        Constants.mazeWidth = _gridWidth;
        Constants.mazeHeight = _gridHeight;
        Drawer.gameCanvasWidth = (_gridWidth * Constants.gridSquareSize) + Constants.gridSquareSize / 20;
        Drawer.gameCanvasHeight = (_gridHeight * Constants.gridSquareSize) + Constants.gridSquareSize / 20;
        this.mazeGrid = new MazeGrid(_gridWidth, _gridHeight);
        this.matrix = this.mazeGrid;
    }

    render() {
        this.drawer.resize();
        this.drawer.clear();
        for (let x = 0; x < this.mazeGrid.width; x++) {
            for (let y = 0; y < this.mazeGrid.height; y++) {
                this.drawer.drawPhysicalObject(this.mazeGrid.getSquare(x,y));
            }
        }
        for (let i = 0; i < this.mazeGrid.listDoors.length; i++) {
            if(!this.mazeGrid.listDoors[i].isOpen)
            this.drawer.drawPhysicalObject(this.mazeGrid.listDoors[i]);
        }
    }
}