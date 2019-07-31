import { PhysicalRectangle } from "./physics/physical-objects-interfaces";

export default class Door implements PhysicalRectangle {
    
    static listDoors: Door[] = [];
    
    width: number;
    height: number;

    isOpenable: boolean;
    isOpen: boolean;

    x: number;
    y: number;
    isVertical: boolean;

    constructor(_mapX: number, _mapY: number, _isVertical: boolean, _isOpenable: boolean) {
        this.isOpenable = _isOpenable;
        this.isOpen = false;
        this.x = _mapX;
        this.y = _mapY;
        this.isVertical = _isVertical;
        this.width = (this.isVertical) ? 2 : 20;
        this.height = (this.isVertical) ? 20 : 2;

        Door.listDoors.push(this);
    }

    open(): void {
        if (this.isOpenable) {
            this.isOpen = true;
        }
    }
}
