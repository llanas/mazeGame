import Door from "./door";
import { Position } from "../physics/utils/physical-tools";
import PhysicalRectangle from "../physics/objects/physical-rectangle";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";

export class Square extends PhysicalRectangle {

    public static listSquares: Square[] = [];

    position: Position;
    number: number;
    isTreated: boolean;
    isInSolutionPath: boolean;
    private _hasBeenPassed: boolean = false;

    topDoor: Door;
    rightDoor: Door;
    bottomDoor: Door;
    leftDoor: Door;

    constructor(_number: number = 0, position: Position = new Position(0,0)) {
        super(position, Constants.gridSquareSize, Constants.gridSquareSize, CONST_COLIDING_PARAMETERS.EMPTY_COLIDING, ObjectRenderer.squareBase);

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

    get renderer(): ObjectRenderer {
        if(this.isInSolutionPath) {
            return ObjectRenderer.squareInSolution;
        } else{
            return (this.isTreated) ? ObjectRenderer.squareTreated : ObjectRenderer.squareBase;
        }
    }

    // GETTEUR SETTEURS
    public get hasBeenPassed(): boolean {
        return this._hasBeenPassed;
    }
    public set hasBeenPassed(v : boolean) {
        this._hasBeenPassed = v;
    }
    

}
