import Door from "./door";

export default class Square {

    public static listSquares: Square[] = [];

    position: number;
    number: number;
    x: number;
    y: number;
    isTreated: boolean;
    isInSolutionPath: boolean;

    topDoor: Door;
    rightDoor: Door;
    bottomDoor: Door;
    leftDoor: Door;

    constructor(_number: number, _mapX: number, _mapY: number) {
        this.position = _number;
        this.number = _number;
        this.x = _mapX;
        this.y = _mapY;
        this.isTreated = false;
        
        Square.listSquares.push(this);
    }

    getDoorsOpen(): Door[] {
        let listDoorsOpen: Door[] = [];

        if(this.topDoor.isOpen) listDoorsOpen.push(this.topDoor);
        if(this.rightDoor.isOpen) listDoorsOpen.push(this.rightDoor);
        if(this.bottomDoor.isOpen) listDoorsOpen.push(this.bottomDoor);
        if(this.leftDoor.isOpen) listDoorsOpen.push(this.leftDoor);
        
        return listDoorsOpen;
    }

    getColor(): string {
        if(this.isInSolutionPath) {
            return 'rgb(125, 125, 200)'
        } else{
            return (this.isTreated) ? 'rgb(200, 225, 55)' : 'rgb(220, 90, 90)';
        }
    }
}
