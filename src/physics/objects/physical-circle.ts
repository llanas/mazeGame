import { PhysicalObject } from "./physical-object";
import PhysicalRectangle from "./physical-rectangle";
import PhysicsUtils from "../utils/physical-utils";
import Vector from "./physical-vector";
import { ObjectRenderer } from "../../renderer/object-renderer";
import { ColidingParameters } from "../utils/physical-parameters";

export default class PhysicalCircle extends PhysicalObject {

    radius: number;

    constructor(_position: Vector, _radius: number, _colidingParameters: ColidingParameters, _renderer?: ObjectRenderer) {
        super(_position, _colidingParameters, _renderer);
        this.radius = _radius;
    }

    get center(): Vector {
        return new Vector(this.position.x, this.position.y);
    }

    move(movingVector: Vector = this.movingVector) {
        if(movingVector != null) {
            super.move(movingVector);
        }
    }

    checkCollision(object: PhysicalObject, newPosition: Vector): boolean {
        let isColliding = false;
        
        if(object instanceof PhysicalRectangle) {
            let closestX = PhysicsUtils.findClosestFromCircleCenter(newPosition.x, object.position.x, object.position.x + object.width);
            let closestY = PhysicsUtils.findClosestFromCircleCenter(newPosition.y, object.position.y, object.position.y + object.height);

            let deltaX = newPosition.x - closestX;
            let deltaY = newPosition.y - closestY;

            isColliding = Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(this.radius, 2);
        } else if(object instanceof PhysicalCircle) {
            let deltaX = newPosition.x - object.position.x;
            var deltaY = newPosition.y - object.position.y;
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            isColliding = distance < this.radius + this.radius;
        }
        return isColliding;
    }

    colidingWith(colidingObject: PhysicalObject) {
        if(this.colidingParameters.sliding) {
            if(colidingObject instanceof PhysicalRectangle) {
                this.movingVector = colidingObject.getVectorAfterSlide(this.position, this.radius, this.movingVector);
            }
        } else if(this.colidingParameters.bouncing) {
            if(colidingObject instanceof PhysicalRectangle) {
                this.movingVector = colidingObject.getVectorAfterBounce(this.position, this.movingVector);
            }
        } else if(this.colidingParameters.destroyOnColision) {
           this.destroy();
        }
    }
}