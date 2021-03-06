import PhysicalCircle from '../physics/objects/physical-circle';
import { PhysicalObject } from '../physics/objects/physical-object';
import { CONST_COLIDING_PARAMETERS } from '../physics/utils/physical-parameters';
import Vector from '../physics/utils/physical-vector';
import { ObjectRenderer } from '../renderer/object-renderer';
import { Constants } from '../utils/constants';
import { ILiving } from './interfaces/living-interface';
import { IMovable } from './interfaces/movable-interface';

export class Bullet extends PhysicalCircle implements IMovable {

    damage: number = Constants.bulletDamage;
    speed: number = Constants.bulletSpeed;

    constructor (_position: Vector, _direction: Vector) {
        super(_position, Constants.bulletSize, CONST_COLIDING_PARAMETERS.BULLET_COLIDING, ObjectRenderer.bullet);
        this.movingVector = _direction.normalize().scale(this.speed);
    }

    colidingWith(objectColidingWith: PhysicalObject | ILiving) {
        super.colidingWith(objectColidingWith as PhysicalObject);
        if ("damaging" in objectColidingWith) {
            objectColidingWith.damaging(this.damage);
        }
    }
}