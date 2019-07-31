import PhysicalObject from "./physical-object";
import { Position } from "../utils/physical-tools";
import PhysicalRectangle from "./physical-rectangle";

export default class PhysicalCircle extends PhysicalObject {

    radius: number;

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _radius: number) {
        super(_position, _movable, _coliding);
        this.radius = _radius;
    }

    checkCollision(object: PhysicalObject): boolean {
        let isColliding = false;
        if(object instanceof PhysicalRectangle) {
            let deltaX = Math.abs(this.position.x - (object.position.x - object.width / 2));
            let deltaY = Math.abs(this.position.y - (object.position.y - object.height / 2));

            if(deltaX > (this.radius + object.width / 2)) return false;
            if(deltaY > (this.radius + object.height / 2)) return false;

            if(deltaX <= (object.width / 2)) return true;
            if(deltaY <= (object.height / 2)) return true;

            let dx = deltaX - object.width / 2;
            let dy = deltaY - object.height / 2;
            isColliding =  (dx * dx + dy * dy <= (this.radius * this.radius));
        } else {
            let deltaX = this.position.x - object.position.x;
            var deltaY = this.position.y - object.position.y;
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            isColliding = distance < this.radius + this.radius;
        }
    }
}