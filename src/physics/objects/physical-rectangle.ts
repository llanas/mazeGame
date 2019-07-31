import PhysicalObject from "./physical-object";
import { Position } from "../utils/physical-tools";
import PhysicalCircle from "./physical-circle";

export default class PhysicalRectangle extends PhysicalObject {

    width: number;
    height: number;

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _width: number, _height: number) {
        super(_position, _movable, _coliding);
        this.width = _width;
        this.height = _height;
    }

    checkCollision(object: PhysicalObject): boolean {
        let isColliding = false;
        if(object instanceof PhysicalRectangle) {
            isColliding = 
                this.position.x < object.position.x + object.width 
                && this.position.x + this.width > object.position.x
                && this.position.y < object.position.y + object.height 
                && this.height + this.position.y > object.position.y
        } else if(object instanceof PhysicalCircle) {
            let deltaX = Math.abs(object.position.x - (this.position.x - this.width / 2));
            let deltaY = Math.abs(object.position.y - (this.position.y - this.height / 2));

            if(deltaX > (object.radius + this.width / 2)) return false;
            if(deltaY > (object.radius + this.height / 2)) return false;

            if(deltaX <= (this.width / 2)) return true;
            if(deltaY <= (this.height / 2)) return true;

            let dx = deltaX - this.width / 2;
            let dy = deltaY - this.height / 2;
            isColliding =  (dx * dx + dy * dy <= (object.radius * object.radius));
        }
        return isColliding;
    }
}