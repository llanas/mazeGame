import PhysicalCircle from "../physics/objects/physical-circle";
import Vector from "../physics/objects/physical-vector";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";

export class Bullet extends PhysicalCircle {

    movingVector: Vector;
    speed: number = Constants.bulletSpeed;
    
    constructor(_position: Position, _direction: Vector) {
        super(_position, Constants.bulletSize, CONST_COLIDING_PARAMETERS.BULLET_COLIDING, ObjectRenderer.bullet);
        this.movingVector = _direction.normalize().scale(this.speed);
    }
}