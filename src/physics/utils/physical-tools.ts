import { Constants } from "../../utils/constants";
import Vector from "../objects/physical-vector";
import { PhysicalObject } from "../objects/physical-object";
import { ColidingParameters } from "./physical-parameters";

export interface Coordonate {
    x: number;
    y: number;
}

export class Position implements Coordonate {

    public static buildFromGridPosition(gridX: number, gridY: number) {
        return new Position(gridX * Constants.gridSquareSize, gridY * Constants.gridSquareSize, {x:gridX, y:gridY});
    }

    x: number;
    y: number;

    private _gridPosition: Coordonate;

    public get gridPosition(): Coordonate {
        return this._gridPosition;
    };

    private _vector: Vector;
    public get vector() : Vector {
        return this._vector;
    }

    constructor(_x: number, _y: number, _gridPosition?: Coordonate | null) {
        this.x = _x;
        this.y = _y;
        this._vector = new Vector(this.x, this.y);
        if(_gridPosition != null) {
            this._gridPosition = _gridPosition;
        } else {
            this._gridPosition = {x: Math.floor(this.x / Constants.gridSquareSize), y: Math.floor(this.y / Constants.gridSquareSize)};
        }
    }

    move(movingVector: Vector): Position {
        this.x += movingVector.x;
        this.y += movingVector.y;
        this._vector = new Vector(this.x, this.y);
        this._gridPosition = {x: Math.floor(this.x / Constants.gridSquareSize), y: Math.floor(this.y / Constants.gridSquareSize)};
        return this;
    }
    
    clone(): Position {
        return new Position(this.x, this.y);
    }
}


export class ListPhysicalObject<T extends PhysicalObject> extends Array<T> {

    constructor() {
        super();
    }

    getAll<L extends T>(condition?: ColidingParameters, typeFilter?: new ()=>L): T[] {
        let listPhysicalObjects: T[] | L[] = [];
        if(condition != null || typeFilter != null) {
            for (let i = 0; i < this.length; i++) {
                if(condition != null && typeFilter != null) {
                    if(this[i].colidingParameters.equals(condition) && this[i] instanceof typeFilter) {
                        listPhysicalObjects.push(<L> this[i]);
                    }
                } else if(condition != null && this[i].colidingParameters.equals(condition)) {
                    listPhysicalObjects.push(<L> this[i]);
                } else if(typeFilter != null && this[i] instanceof typeFilter) {
                    listPhysicalObjects.push(<L> this[i]);
                }
            }
        } else {
            listPhysicalObjects = this;
        }
        return listPhysicalObjects;    
    }

    push(object: T): number {
        if(this.indexOf(object) === -1) {
            super.push(object);
        }
        return this.length;
    }

    remove(object: T): void {
        let index = this.indexOf(object);
        if(index != -1) {
            super.splice(index, 1);
        }
    }
}