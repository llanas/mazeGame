import { PhysicalLayer } from "./physical-layer";
import { MazeGrid } from "../../model/maze-grid";
import { Drawer } from "../../renderer/drawer";
import { Constants } from "../../utils/constants";

const groundGridScale = 100;
export class GroundLayer extends PhysicalLayer {

    mazeGrid: MazeGrid;

    constructor() {
        super(Constants.mazeWidth, Constants.mazeHeight, new Drawer(Constants.groundLayerId));
        this.mazeGrid = new MazeGrid(Constants.mazeWidth, Constants.mazeHeight);
        this.matrix = this.mazeGrid;
    }

    render() {
        this.drawer.resize();
        this.drawer.clear();
        for (let x = 0; x < this.mazeGrid.width; x++) {
            for (let y = 0; y < this.mazeGrid.height; y++) {
                this.drawer.drawPhysicalObject(this.mazeGrid.getSquare({x:x, y:y}));
            }
        }
        for (let i = 0; i < this.mazeGrid.listDoors.length; i++) {
            if(!this.mazeGrid.listDoors[i].isOpen)
            this.drawer.drawPhysicalObject(this.mazeGrid.listDoors[i]);
        }
    }
}