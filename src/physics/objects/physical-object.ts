import { Position } from "../utils/physical-tools";

export default class PhysicalObject {

    public static listMovableObjects: PhysicalObject[] = [];
    public static listColidingObjects: PhysicalObject[] = [];

    position: Position;
    movable: boolean;
    coliding: boolean;

    constructor(_position: Position, _movable: boolean, _coliding: boolean) {
        this.position = _position;
        this.movable = _movable;
        this.coliding = _coliding;

        if(this.movable) {
            PhysicalObject.listMovableObjects.push(this);
        } else if(this.coliding) {
            PhysicalObject.listColidingObjects.push(this);
        }
    }

    checkCollision(object: PhysicalObject): boolean {
        return (this.position.x === object.position.x || this.position.y === object.position.y);
    }
}