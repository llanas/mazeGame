import { Position } from "../physics/utils/physical-tools";
import PhysicalRectangle from "../physics/objects/physical-rectangle";

const doorLength = 30;
const doorWidth = 2;

export default class Door extends PhysicalRectangle {

    public static listDoors: Door[] = [];

    isOpenable: boolean;
    isOpen: boolean;

    isVertical: boolean;

    constructor(_position: Position, _isVertical: boolean, _isOpenable: boolean) {
        if(_isVertical) {
            _position.x--;
        } else {
            _position.y--;
        }
        super(_position, false, true, (_isVertical) ? doorWidth : doorLength, (_isVertical) ? doorLength : doorWidth);

        this.isOpenable = _isOpenable;
        this.isOpen = false;
        this.isVertical = _isVertical;

        Door.listDoors.push(this);
    }

    open(): void {
        if (this.isOpenable) {
            this.isOpen = true;
            this.coliding = false;
        }
    }

    toString() {
        return `[${this.position.gridPosition.x},${this.position.gridPosition.y} - ${this.isVertical}] - open : ${this.isOpen} - coliding : ${this.coliding}`;
    }
}
