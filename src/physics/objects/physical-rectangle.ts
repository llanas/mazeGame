import PhysicalObject from "./physical-object";
import { Position, Coordonate, Direction } from "../utils/physical-tools";
import PhysicalCircle from "./physical-circle";
import PhysicsUtils from "../utils/physical-utils";
import Vector from "./physical-vector";

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

    getVectorAfterSlide(position: Position, radius: number, movingVector: Vector): Vector {

        let minX = Math.min(this.position.x, this.position.x + this.width);
        let maxX = Math.max(this.position.x, this.position.x + this.width);
        let minY = Math.min(this.position.y, this.position.y + this.height);
        let maxY = Math.max(this.position.y, this.position.y + this.height);

        let newX = position.x + movingVector.x;
        let newY = position.y + movingVector.y;

        let side = 0;

        if(minY > newY) side += 1; // Si top
        if(maxX < newX) side += 2; // Si right
        if(maxY < newY) side += 4; // Si bottom
        if(minX > newX) side += 8; // Si left

        let movingAngle = movingVector.angleDeg();

        switch(side) {
            case 0:
                throw "Incident de collision, le point est à l'intérieur du rectangle";
            case 1: // Only TOP
                movingVector.y = 0;
                break;
            case 2: // Only RIGHT
                movingVector.x = 0;
                break;
            case 4: // Only BOTTOM
                movingVector.y = 0;
                break;
            case 8: // Only LEFT
                movingVector.x = 0;
                break;
            case 3: // TOP-RIGHT
                if(movingAngle === -45) movingVector.x++;
                else if(movingAngle < -45) movingVector.x;
                else movingVector.y = 0;
                break;
            case 6: // RIGHT-BOTTOM
                if(movingAngle === 45) movingVector.x++;
                else if(movingAngle > 45) movingVector.x = 0;
                else movingVector.y = 0;
                break;
            case 12: // BOTTOM-LEFT
                if(movingAngle === 135) movingVector.x--;
                if(movingAngle < 135) movingVector.x = 0;
                else movingVector.y = 0;
                break;
            case 9: // LEFT-TOP
                if(movingAngle === -135) movingVector.x--;
                if(movingAngle > -135) movingVector.x = 0;
                else movingVector.y = 0;
                break;
        }
        return movingVector;
    }
}