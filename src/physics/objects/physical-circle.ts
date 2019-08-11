import { PhysicalObject } from "./physical-object";
import { Position } from "../utils/physical-tools";
import PhysicalRectangle from "./physical-rectangle";
import PhysicsUtils from "../utils/physical-utils";
import Vector from "./physical-vector";
import { ObjectRenderer } from "../../renderer/object-renderer";

export default class PhysicalCircle extends PhysicalObject {

    radius: number;

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _radius: number, _renderer?: ObjectRenderer) {
        super(_position, _movable, _coliding, _renderer);
        this.radius = _radius;
    }

    move(movingVector: Vector = this.movingVector) {
        if(movingVector != null) {
            let listColingObject = PhysicalObject.getListColidingsObjects(this.position.gridPosition);
            for (let i = 0; i < listColingObject.length; i++) {
                const objectColidingWith = listColingObject[i];
                if(this.checkCollision(objectColidingWith, movingVector)) {
                    if(this.sliding) {
                        if(objectColidingWith instanceof PhysicalRectangle) {
                            movingVector = objectColidingWith.getVectorAfterSlide(this.position, this.radius, movingVector);
                            if(movingVector.isZero()) return;
                        }
                    } else if(this.destroyOnColision) {
                       this.destroy();
                    }
                }
            }
            super.move(movingVector);
        }
    }

    checkCollision(object: PhysicalObject, movingVector: Vector): boolean {
        let isColliding = false;
        let newX = this.position.x + movingVector.x;
        let newY = this.position.y + movingVector.y;
        
        if(object instanceof PhysicalRectangle) {
            let closestX = PhysicsUtils.findClosestFromCircleCenter(newX, object.position.x, object.position.x + object.width);
            let closestY = PhysicsUtils.findClosestFromCircleCenter(newY, object.position.y, object.position.y + object.height);

            let deltaX = newX - closestX;
            let deltaY = newY - closestY;

            isColliding = Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(this.radius, 2);
        } else if(object instanceof PhysicalCircle) {
            let deltaX = newX - object.position.x;
            var deltaY = newY - object.position.y;
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            isColliding = distance < this.radius + this.radius;
        }
        return isColliding;
    }
}