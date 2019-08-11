import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
import Vector from "../physics/objects/physical-vector";
import { Constants } from "../utils/constants";
import Square from "./square";
import { MazeGrid } from "./maze-grid";
import { Bullet } from "./bullet";
import { ObjectRenderer } from "../renderer/object-renderer";

export default class Player extends PhysicalCircle {
    

    public speed: number;
    public visibilityRadius: number = Constants.playerVisibilityRadius;
    public listVisibleSquares: Square[] = [];
    public detonationOnCooldown: boolean = false;

    constructor(position: Position) {
        super(position, true, true, Constants.playerSize, ObjectRenderer.player);
        this.sliding = true;
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

    fire(fireDirection: Position): Bullet | null {
        let newBullet = null;
        if(!this.detonationOnCooldown) {
            fireDirection.vector.subtract(this.position);
            newBullet = new Bullet(this.position.clone(), fireDirection.vector);
            setTimeout(() => this.detonationOnCooldown = false, Constants.playerFireDetonationCooldown);
            this.detonationOnCooldown = true;
        }
        return newBullet;
    }
}