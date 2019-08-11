import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
import Vector from "../physics/objects/physical-vector";
import { Constants } from "../utils/constants";
import Square from "./square";
import { MazeGrid } from "./maze-grid";

export default class Player extends PhysicalCircle {

    public speed: number;
    public visibilityRadius: number = Constants.playerVisibilityRadius;
    public listVisibleSquares: Square[] = [];

    constructor(position: Position) {
        super(position, true, true, true, Constants.playerSize);
        this.speed = Constants.defaultPlayerSpeed;
        this.listVisibleSquares = MazeGrid.getInstance().getStraightPathsFromPosition(position);
    }

    move(movingVector: Vector) {
        if(!movingVector.isZero()) {
            let oldPositionGrid = this.position.gridPosition;
            movingVector
                .normalize()
                .scale(this.speed)
                .toFixed(2);
            super.move(movingVector);
            if(oldPositionGrid != this.position.gridPosition) {
                MazeGrid.getInstance().getSquareByGridPosition(this.position.gridPosition.x, this.position.gridPosition.y).hasBeenPassed = true;
                this.listVisibleSquares = MazeGrid.getInstance().getStraightPathsFromPosition(this.position);
            }
        }
    }
}