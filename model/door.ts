export default class Door {

    static listDoors: Door[] = [];

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

        Door.listDoors.push(this);
    }

    open(): void {
        if (this.isOpenable) {
            this.isOpen = true;
        }
    }
}
