import PhysicalCircle from "../physics/objects/physical-circle";
import Vector from "../physics/objects/physical-vector";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";

export class Bullet extends PhysicalCircle {

    movingVector: Vector;
    speed: number = Constants.bulletSpeed;
    
    constructor(_position: Position, _direction: Vector) {
        super(_position, true, true, Constants.bulletSize, ObjectRenderer.bullet);
        this.destroyOnColision = true;
        this.movingVector = _direction.normalize().scale(this.speed);
    }
}