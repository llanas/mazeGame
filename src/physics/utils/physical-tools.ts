import { Constants } from "../../utils/constants";
import PhysicsUtils from "./physical-utils";
import Vector from "../objects/physical-vector";

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

    move(movingVector: Vector) {
        this.x += movingVector.x;
        this.y += movingVector.y;
        this._vector = new Vector(this.x, this.y);
        this._gridPosition = {x: Math.floor(this.x / Constants.gridSquareSize), y: Math.floor(this.y / Constants.gridSquareSize)};
    }
    
    clone(): Position {
        return new Position(this.x, this.y);
    }
}