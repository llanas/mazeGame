import { Position } from "../physics/utils/physical-tools";
import PhysicalRectangle from "../physics/objects/physical-rectangle";

const doorLength = 20;
const doorWidth = 2;

export default class Door extends PhysicalRectangle {

    public static listDoors: Door[] = [];

    mazePosition: Position;
    isOpenable: boolean;
    isOpen: boolean;

    isVertical: boolean;

    constructor(_mapX: number, _mapY: number, _isVertical: boolean, _isOpenable: boolean) {
        let doorPosition = new Position(_mapX * , _mapY);
        super(doorPosition, false, true, (_isVertical) ? doorWidth : doorLength, (_isVertical) ? doorLength : doorWidth);

        this.mazePosition = new Position(_mapX, _mapY);
        this.isOpenable = _isOpenable;
        this.isOpen = false;
        this.isVertical = _isVertical;

        Door.listDoors.push(this);
    }

    open(): void {
        if (this.isOpenable) {
            this.isOpen = true;
        }
    }
}
