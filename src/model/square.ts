import Door from "./door";
import { Position } from "../physics/utils/physical-tools";
import PhysicalRectangle from "../physics/objects/physical-rectangle";

const squareWidth = 20;
const squareHeight = 20;

export default class Square extends PhysicalRectangle {

    public static listSquares: Square[] = [];

    position: Position;
    mazePosition: Position;
    number: number;
    isTreated: boolean;
    isInSolutionPath: boolean;

    topDoor: Door;
    rightDoor: Door;
    bottomDoor: Door;
    leftDoor: Door;

    constructor(_number: number, _mapX: number, _mapY: number) {
        let squarePosition = new Position(_mapX * squareWidth, _mapY * squareHeight);
        super(squarePosition, false, false, squareWidth, squareHeight);
        
        this.mazePosition = new Position(_mapX, _mapY);
        this.number = _number;
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
