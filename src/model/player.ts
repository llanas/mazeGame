import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
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
import { Game } from "../game/game";
import { MazeGrid } from "./maze-grid";

export default class Player extends PhysicalCircle implements ILiving, IMovable {
    
    public life: number = 200;
    public speed: number;
    public visibilityRadius: number = Constants.playerVisibilityRadius;
    public detonationOnCooldown: boolean = false;
    public treeNode: TreeNode;

    constructor(position: Position) {
        super(position, Constants.playerSize, CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, ObjectRenderer.player);
        this.colidingParameters.sliding = true;
        this.speed = Constants.defaultPlayerSpeed;
    }

    move() {
        let oldGridPosition = this.position.clone().gridPosition;
        super.move();
        if(this.position.gridPosition != oldGridPosition) {
            this.treeNode = new TreeNode(this.position);
        }
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