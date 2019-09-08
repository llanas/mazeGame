import PhysicalCircle from "../physics/objects/physical-circle";
import Vector from "../physics/objects/physical-vector";
import { Constants } from "../utils/constants";
import { Bullet } from "./bullet";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";
import { ILiving } from "./interfaces/living-interface";
import { PhysicalObject } from "../physics/objects/physical-object";
import { Enemy } from "./enemy";
import { IMovable } from "./interfaces/movable-interface";
import { TreeNode } from "../algo/treeNode";

export default class Player extends PhysicalCircle implements ILiving, IMovable {
    
    public life: number = 200;
    public speed: number;
    public visibilityRadius: number = Constants.playerVisibilityRadius;
    public detonationOnCooldown: boolean = false;
    public treeNode: TreeNode;

    constructor(position: Vector) {
        super(position, Constants.playerSize, CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, ObjectRenderer.player);
        this.colidingParameters.sliding = true;
        this.speed = Constants.defaultPlayerSpeed;
    }

    move() {
        super.move();
    }

    getPositionAfterMove(vector: Vector = this.movingVector): Vector {
        return super.getPositionAfterMove(vector.normalize().scale(this.speed).toFixed(2));
    }

    fire(fireDirection: Vector): Bullet | null {
        let newBullet = null;
        if(!this.detonationOnCooldown) {
            fireDirection.subtract(this.position);
            newBullet = new Bullet(this.position.clone(), fireDirection);
            setTimeout(() => this.detonationOnCooldown = false, Constants.playerFireDetonationCooldown);
            this.detonationOnCooldown = true;
        }
        return newBullet;
    }

    colidingWith(objectColidingWith: PhysicalObject | ILiving) {
        if(objectColidingWith instanceof Enemy) {
            this.damaging(50);
        }
        super.colidingWith(objectColidingWith as PhysicalObject);
    }

    damaging(damageAmount: number): void {
        this.life -= damageAmount;
        if(this.life <= 0) {
            this.destroy();
        }
    }
}