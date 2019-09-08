import Door from "./door";
import PhysicalRectangle from "../physics/objects/physical-rectangle";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";
import Vector from "../physics/objects/physical-vector";
import { Coordonate } from "../physics/utils/physical-tools";

export class Square extends PhysicalRectangle {

    public static listSquares: Square[] = [];

    position: Vector;
    coordonate: Coordonate;
    number: number;
    isTreated: boolean;
    isInSolutionPath: boolean;
    private _hasBeenPassed: boolean = false;

    topDoor: Door;
    rightDoor: Door;
    bottomDoor: Door;
    leftDoor: Door;

    constructor(_number: number = 0, position: Vector = new Vector(0,0)) {
        super(position, Constants.gridSquareSize, Constants.gridSquareSize, CONST_COLIDING_PARAMETERS.EMPTY_COLIDING, ObjectRenderer.squareBase);

        this.coordonate = {x: Math.floor(position.x / Constants.gridSquareSize), y: Math.floor(position.y / Constants.gridSquareSize)}
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

    getCenterPosition(): Vector {
        return new Vector(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
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
