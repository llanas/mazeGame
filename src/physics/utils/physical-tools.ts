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

    constructor(_x: number, _y: number, _gridPosition?: Coordonate | null) {
        this.x = _x;
        this.y = _y;
        if(_gridPosition != null) {
            this._gridPosition = _gridPosition;
        } else {
            this._gridPosition = {x: Math.floor(this.x / Constants.gridSquareSize), y: Math.floor(this.y / Constants.gridSquareSize)};
        }
    }

    move(movingVector: Vector) {
        this.x += movingVector.x;
        this.y += movingVector.y;
        this._gridPosition = {x: Math.floor(this.x / Constants.gridSquareSize), y: Math.floor(this.y / Constants.gridSquareSize)};
    }

    getNewPositionAfterMove(direction: Direction, speed: number) {
        let newX = Number((speed * Math.cos(PhysicsUtils.toRadian(direction.angle))).toFixed(2));
        let newY = Number((speed * Math.sin(PhysicsUtils.toRadian(direction.angle))).toFixed(2));
        return new Position(this.x + newX, this.y + newY);
    }
}

export class Direction {

    public static buildDirectionFromPositions(destination: Position, origin: Position = new Position(0,0)): Direction {
        if(destination == origin) {
            throw "Les deux position sont les mêmes";
        }
        let angle = null;
        let deltaX = destination.x - origin.x;
        let deltaY = destination.y - origin.y;

        if(deltaX === 0) {
            angle = (deltaY / Math.abs(deltaY)) * 90; 
        } else if(deltaY === 0) {
            angle = (deltaX > 0) ? 0 : 180;
        } else {
            angle = PhysicsUtils.toDegree(Math.atan(deltaX / deltaY));
            if(deltaX < 0) {
                angle = (deltaY / Math.abs(deltaY)) * (90 + Math.abs(angle));
            }
        }
        return new Direction(angle);
    }

    private _angle: number;

    constructor(_angle: number) {
        this._angle = _angle;
    }

    public get angle(): number {
        return this._angle;
    }

}