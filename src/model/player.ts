import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
import Vector from "../physics/objects/physical-vector";
import { Constants } from "../utils/constants";
import { Bullet } from "./bullet";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";

export default class Player extends PhysicalCircle {

    public speed: number;
    public visibilityRadius: number = Constants.playerVisibilityRadius;
    public detonationOnCooldown: boolean = false;

    constructor(position: Position) {
        super(position, Constants.playerSize, CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, ObjectRenderer.player);
        this.colidingParameters.sliding = true;
        this.speed = Constants.defaultPlayerSpeed;
    }

    getPositionAfterMove(vector: Vector = this.movingVector): Position {
        return super.getPositionAfterMove(vector.normalize().scale(this.speed).toFixed(2));
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