import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";
import { ILiving } from "./living/living-interface";

export class Enemy extends PhysicalCircle implements ILiving {

    life: number = 100;
    
    constructor(position: Position, _life?: number) {
        super(position, Constants.playerSize, CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, ObjectRenderer.enemies);
    }
    
    damaging(damageAmount: number) {
        this.life -= damageAmount;
        if(this.life <= 0) {
            this.destroy();
        }
    }
}