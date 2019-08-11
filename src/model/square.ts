import Door from "./door";
import { Position } from "../physics/utils/physical-tools";
import PhysicalRectangle from "../physics/objects/physical-rectangle";
import { Constants } from "../utils/constants";

export default class Square extends PhysicalRectangle {

    public static listSquares: Square[] = [];

    position: Position;
    number: number;
    isTreated: boolean;
    isInSolutionPath: boolean;

    topDoor: Door;
    rightDoor: Door;
    bottomDoor: Door;
    leftDoor: Door;

    constructor(_number: number, position: Position) {
        super(position, false, false, Constants.gridSquareSize, Constants.gridSquareSize);

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
