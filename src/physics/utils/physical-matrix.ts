import { Constants } from '../../utils/constants';
import { PhysicalObject } from '../objects/physical-object';
import Vector from '../objects/physical-vector';
import { ColidingParameters } from './physical-parameters';
import { Coordonate, ListPhysicalObject } from './physical-tools';

/**
 * PhysicalMatrix
 * 
 * This is a 2D matrix that contains list of PhysicalObject
 * It allows to handle performance issues and manage object placement inside au divided matrix
 */
export class PhysicalMatrix<T extends PhysicalObject> {

    private matrix: Map<number, Map<number, ListPhysicalObject<T>>> = new Map();
    matrixScaleWidth: number;
    matrixScaleHeight: number;

    /**
     * @param matrixScaleWidth Width scale of the matrix
     * @param matrixScaleHeight Height scale of the matrix
     */
    constructor (matrixScaleWidth: number, matrixScaleHeight: number) {
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

    /**
     * Function that get real position (like inside the canvas) and returns the position relative to this matrix
     * 
     * @param position Reel position coordonate of the object
     * 
     * @returns Coordonate of the position relative to the matrix
     */
    getMatrixPositionByScale(position: { x: number, y: number }): Coordonate {
        return { x: Math.floor(position.x / (Constants.gameCanvasWidth / this.matrixScaleWidth)), y: Math.floor(position.y / (Constants.gameCanvasHeight / this.matrixScaleHeight)) };
    }

    /**
     * Function that check if the coordonate is inside this matrix
     * 
     * @param position Coordonate to check
     */
    hasPosition(position: Coordonate): boolean {
        return this.matrix.has(position.x) && this.matrix.get(position.x).has(position.y);
    }

    /**
     * Function that extend the matrix on both axis by the ration give as parameter
     * It is used mostly to keep track of element whose position are out of the canvas matrix but can still be drawn
     * 
     * @param scale Ratio number to scale the matrix with
     */
    extend(scale: number) {
        for (let x = -scale; x < this.matrixScaleWidth + scale; x++) {
            if (!this.matrix.has(x)) this.matrix.set(x, new Map<number, ListPhysicalObject<T>>());
            for (let y = -scale; y < this.matrixScaleHeight + scale; y++) {
                if (!this.matrix.get(x).has(y)) this.matrix.get(x).set(y, new ListPhysicalObject<T>());
            }
        }
    }

    /**
     * Function that allows to get every PhysicalObject of a given position
     * It can have specific coliding needs & specific filter to apply
     * 
     * @param x X axis coordinate
     * @param y Y axis coordinate
     * @param colidingParameters Advanced query on coliding parameters
     * @param typeFilter Function filter to apply
     * 
     * @returns list of PhysicalObject
     */
    get<L extends T>(x: number, y: number, colidingParameters?: ColidingParameters, typeFilter?: new () => L): T[] {
        return this.matrix.get(x).get(y).getAll<L>(colidingParameters, typeFilter);
    }

    /**
     * Function that "flat" the matrix by returning every element inside an array
     * It can have specific coliding needs & specific filter to apply
     * 
     * @param colidingParameters Advanced query on coliding parameters
     * @param typeFilter Function filter to apply
     * 
     * @returns list of PhysicalObject
     */
    getAll<L extends T>(colidingParameters?: ColidingParameters, typeFilter?: { new(): L }): T[] {
        let listColidingObjects = [];
        for (let x = 0; x <= this.matrix.size; x++) {
            let columnMap = this.matrix.get(x);
            if (columnMap == undefined) continue;
            for (let y = 0; y <= columnMap.size; y++) {
                if (columnMap.get(y) == undefined) continue;
                listColidingObjects.push(...columnMap.get(y).getAll<L>(colidingParameters, typeFilter));
            }
        }
        return listColidingObjects;
    }

    /**
     * Function that get every PhysicalObject around a given position
     * It can have specific coliding needs
     * 
     * @param position Position in the matrix to look around
     * @param colidingParameters Advanced query on coliding parameters
     */
    getAround(position: Vector, colidingParameters?: ColidingParameters) {

        let listColidingObjects = [];
        let matrixCoordonate = this.getMatrixPositionByScale(position);
        let minX = (matrixCoordonate.x - 1 >= 0) ? matrixCoordonate.x - 1 : 0;
        let maxX = (matrixCoordonate.x + 1 <= this.matrixScaleWidth) ? matrixCoordonate.x + 1 : this.matrixScaleWidth;

        let minY = (matrixCoordonate.y - 1 >= 0) ? matrixCoordonate.y - 1 : 0;
        let maxY = (matrixCoordonate.y + 1 <= this.matrixScaleHeight) ? matrixCoordonate.y + 1 : this.matrixScaleHeight;

        for (let x = minX; x <= maxX; x++) {
            let columnMap = this.matrix.get(x);
            if (columnMap == undefined) continue;
            for (let y = minY; y <= maxY; y++) {
                if (columnMap.get(y) == undefined) continue;
                listColidingObjects.push(...columnMap.get(y).getAll(colidingParameters));
            }
        }
        return listColidingObjects;
    }

    /**
     * Function that push a PhysicalObject in the matrix at a given position
     * 
     * @param object PhysicalObject to add to the matrix
     * @param position Coordonate of the matrix where to put the PhysicalObject
     */
    push(object: T, position?: { x: number, y: number }) {
        let positionInMatrix = (position) ? position : this.getMatrixPositionByScale(object.position);
        this.matrix.get(positionInMatrix.x).get(positionInMatrix.y).push(object);
    }

    /**
     * Function that remove a PhysicalObject from the matrix at a given position
     * 
     * @param object PhysicalObject to remove from the matrix
     * @param position Coordonate of the matrix where to remove the PhysicalObject
     */
    remove(object: T, position?: { x: number, y: number }) {
        let positionInMatrix = (position) ? position : this.getMatrixPositionByScale(object.position);
        this.matrix.get(positionInMatrix.x).get(positionInMatrix.y).remove(object);
    }

    /**
     * Function that move a given PhysicalObject from a position to another based on parameters
     * If the position inside the matrix as changed between both parameters (based on matrix scale)
     * 
     * @param object PhysicalObject to move
     * @param oldPosition old real position of the PhysicalObject
     * @param newPosition new real position of the PhysicalObject
     */
    move(object: T, oldPosition: Vector, newPosition: Vector) {
        let oldPositionInMatrix = this.getMatrixPositionByScale(oldPosition);
        let newPositionInMatrix = this.getMatrixPositionByScale(newPosition);
        if (oldPositionInMatrix != newPositionInMatrix) {
            this.remove(object, oldPositionInMatrix);
            this.push(object, newPositionInMatrix);
        }
    }
}
