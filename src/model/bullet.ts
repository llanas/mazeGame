import PhysicalCircle from "../physics/objects/physical-circle";
import Vector from "../physics/objects/physical-vector";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";
import { PhysicalObject } from "../physics/objects/physical-object";
import { ILiving } from "./living/living-interface";

export class Bullet extends PhysicalCircle {

    movingVector: Vector;
    damage: number = Constants.bulletDamage;
    speed: number = Constants.bulletSpeed;
    
    constructor(_position: Position, _direction: Vector) {
        super(_position, Constants.bulletSize, CONST_COLIDING_PARAMETERS.BULLET_BOUNCING, ObjectRenderer.bullet);
        this.movingVector = _direction.normalize().scale(this.speed);
    }

    colidingWith(objectColidingWith: PhysicalObject | ILiving) {
        super.colidingWith(objectColidingWith as PhysicalObject);
        if("damaging" in objectColidingWith) {
            objectColidingWith.damaging(this.damage);
        }
    }
}