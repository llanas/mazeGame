import { PhysicalObject } from "../objects/physical-object";
import { ListPhysicalObject, Coordonate } from "./physical-tools";
import { ColidingParameters } from "./physical-parameters";
import Vector from "../objects/physical-vector";
import { Constants } from "../../utils/constants";

export class PhysicalMatrix<T extends PhysicalObject> {

    private matrix: Map<number, Map<number, ListPhysicalObject<T>>> = new Map();
    matrixScaleWidth: number;
    matrixScaleHeight: number;

    constructor(matrixScaleWidth: number, matrixScaleHeight: number) {
        this.matrixScaleWidth = matrixScaleWidth;
        this.matrixScaleHeight = matrixScaleHeight;
        for (let x = 0; x < matrixScaleWidth; x++) {
            let columnMap = new Map<number, ListPhysicalObject<T>>();
            for (let y = 0; y < matrixScaleHeight; y++) {
                columnMap.set(y, new ListPhysicalObject<T>());
            }
            this.matrix.set(x, columnMap);
        }
    }

    getMatrixPositionByScale(position: {x: number, y: number}): Coordonate {
        return {x:Math.floor(position.x / (Constants.gameCanvasWidth / this.matrixScaleWidth)), y: Math.floor(position.y / (Constants.gameCanvasHeight / this.matrixScaleHeight))};
    }

    hasPosition(position: Coordonate): boolean {
        return this.matrix.has(position.x) && this.matrix.get(position.x).has(position.y);
    }

    extend(scale: number) {
        for (let x = -scale; x < this.matrixScaleWidth + scale; x++) {
            if(!this.matrix.has(x)) this.matrix.set(x, new Map<number, ListPhysicalObject<T>>());
            for(let y = -scale;  y < this.matrixScaleHeight + scale; y++) {
                if(!this.matrix.get(x).has(y)) this.matrix.get(x).set(y, new ListPhysicalObject<T>());
            }
        }
    }

    get<L extends T>(x: number, y: number, colidingParameters?: ColidingParameters, typeFilter?: new ()=>L): T[] {
        return this.matrix.get(x).get(y).getAll<L>(colidingParameters, typeFilter);
    }

    getAll<L extends T>(colidingParameters?: ColidingParameters, typeFilter?: {new ():L}): T[] {
        let listColidingObjects = [];
        for (let x = 0; x <= this.matrix.size; x++) {
            let columnMap = this.matrix.get(x);
            if(columnMap == undefined) continue;
            for (let y = 0; y <= columnMap.size; y++) {
                if(columnMap.get(y) == undefined) continue;
                listColidingObjects.push(...columnMap.get(y).getAll<L>(colidingParameters, typeFilter));
            }
        }
        return listColidingObjects;
    }

    getAround(position: Vector, colidingParameters?: ColidingParameters) {

        let listColidingObjects = [];
        let matrixCoordonate = this.getMatrixPositionByScale(position);
        let minX = (matrixCoordonate.x - 1 >= 0) ? matrixCoordonate.x - 1 : 0;
        let maxX = (matrixCoordonate.x + 1 <= this.matrixScaleWidth) ? matrixCoordonate.x + 1 : this.matrixScaleWidth;

        let minY = (matrixCoordonate.y - 1 >= 0) ? matrixCoordonate.y - 1 : 0;
        let maxY = (matrixCoordonate.y + 1 <= this.matrixScaleHeight) ? matrixCoordonate.y + 1 : this.matrixScaleHeight;
        
        for (let x = minX; x <= maxX; x++) {
            let columnMap = this.matrix.get(x);
            if(columnMap == undefined) continue;
            for (let y = minY; y <= maxY; y++) {
                if(columnMap.get(y) == undefined) continue;
                listColidingObjects.push(...columnMap.get(y).getAll(colidingParameters));
            }
        }
        return listColidingObjects;
    }

    push(object: T, position?: {x: number, y: number}) {
        let positionInMatrix = (position) ? position: this.getMatrixPositionByScale(object.position);
        this.matrix.get(positionInMatrix.x).get(positionInMatrix.y).push(object);
    }

    remove(object: T, position?: {x: number, y: number}) {
        let positionInMatrix = (position) ? position: this.getMatrixPositionByScale(object.position);
        this.matrix.get(positionInMatrix.x).get(positionInMatrix.y).remove(object);
    }

    move(object: T, oldPosition: Vector, newPosition: Vector) {
        let oldPositionInMatrix = this.getMatrixPositionByScale(oldPosition);
        let newPositionInMatrix = this.getMatrixPositionByScale(newPosition);
        if(oldPositionInMatrix != newPositionInMatrix) {
            this.remove(object, oldPositionInMatrix);
            this.push(object, newPositionInMatrix);
        }
    }
}
