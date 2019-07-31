import PhysicalObject from "./physical-object";
import { Position, Coordonate } from "../utils/physical-tools";
import PhysicalRectangle from "./physical-rectangle";
import PhysicsUtils from "../utils/physical-utils";

export default class PhysicalCircle extends PhysicalObject {

    radius: number;

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _sliding: boolean, _radius: number) {
        super(_position, _movable, _coliding, _sliding);
        this.radius = _radius;
    }

    checkCollision(object: PhysicalObject, newPosition: Coordonate): boolean {
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
}