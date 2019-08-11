import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
import Vector from "../physics/objects/physical-vector";

const defaultSpeed = 2.5;

export default class Player extends PhysicalCircle {

    public speed: number;

    constructor(position: Position) {
        super(position, true, true, true, 5);
        this.speed = defaultSpeed;
    }

    move(movingVector: Vector) {
        if(!movingVector.isZero()) {
            movingVector
                .normalize()
                .scale(this.speed)
                .toFixed(2);
            super.move(movingVector);
        }
    }
}