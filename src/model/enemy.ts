import PhysicalCircle from '../physics/objects/physical-circle';
import { PhysicalObject } from '../physics/objects/physical-object';
import { CONST_COLIDING_PARAMETERS } from '../physics/utils/physical-parameters';
import Vector from '../physics/utils/physical-vector';
import { ObjectRenderer } from '../renderer/object-renderer';
import { Constants } from '../utils/constants';
import { ILiving } from './interfaces/living-interface';
import { IMovable } from './interfaces/movable-interface';
import Player from './player';

export class Enemy extends PhysicalCircle implements ILiving, IMovable {

    life: number = 100;
    speed: number = Constants.defaultPlayerSpeed / 1.5;

    constructor (position: Vector = new Vector(0, 0), _life?: number) {
        super(position, Constants.playerSize, CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, ObjectRenderer.enemies);
    }

    colidingWith(objectColidingWith: PhysicalObject | ILiving) {
        if (objectColidingWith instanceof Player) {
            objectColidingWith.damaging(50);
        }
        super.colidingWith(objectColidingWith as PhysicalObject);
    }

    damaging(damageAmount: number) {
        this.life -= damageAmount;
        if (this.life <= 0) {
            this.destroy();
        }
    }
}