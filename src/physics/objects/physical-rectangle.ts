import PhysicalObject from "./physical-object";
import { Position, Coordonate } from "../utils/physical-tools";
import PhysicalCircle from "./physical-circle";
import PhysicsUtils from "../utils/physical-utils";

export default class PhysicalRectangle extends PhysicalObject {

    width: number;
    height: number;

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _width: number, _height: number) {
        super(_position, _movable, _coliding);
        this.width = _width;
        this.height = _height;
    }

    checkCollision(object: PhysicalObject, newPosition: Coordonate): boolean {
        let isColliding = false;
        if(object instanceof PhysicalRectangle) {
            isColliding = 
                newPosition.x < object.position.x + object.width 
                && newPosition.x + this.width > object.position.x
                && newPosition.y < object.position.y + object.height 
                && this.height + newPosition.y > object.position.y
        } else if(object instanceof PhysicalCircle) {

            let closestX = PhysicsUtils.findClosestFromCircleCenter(object.position.x, newPosition.x, newPosition.x + this.width);
            let closestY = PhysicsUtils.findClosestFromCircleCenter(object.position.y, newPosition.y, newPosition.y + this.height);

            let deltaX = newPosition.x - closestX;
            let deltaY = newPosition.y - closestY;

            isColliding = Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(object.radius, 2);
        }
        return isColliding;
    }
}