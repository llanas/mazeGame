import * as utils from "./physical-utils";

const squareSizes = 20;

export class Position {

    x: number;
    y: number;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }

    getAsPixels(): number {
        return this.x * squareSizes
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
            angle = utils.toDegree(Math.atan(deltaX / deltaY));
            if(deltaX < 0) {
                angle = (deltaY / Math.abs(deltaY)) + 90;
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

export class Vector {

    deltaX: number;
    deltaY: number;
    angle: number;

    constructor(_deltaX: number, _deltaY: number, _angle: number) {
        this.deltaX = _deltaX;
        this.deltaY = _deltaY;
        this.angle = _angle;
    }
}