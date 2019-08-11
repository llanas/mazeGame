import { PhysicalObject } from "../objects/physical-object";
import { Position, ListPhysicalObject, Coordonate } from "./physical-tools";
import { ColidingParameters } from "./physical-parameters";

export class PhysicalMatrix<T extends PhysicalObject> {

    private matrix: Map<number, Map<number, ListPhysicalObject<T>>> = new Map();
    matrixWidth: number;
    matrixHeight: number;

    constructor(gridWidth: number, gridHeight: number) {
        this.matrixWidth = gridWidth;
        this.matrixHeight = gridHeight;
        for (let x = 0; x < gridWidth; x++) {
            let columnMap = new Map<number, ListPhysicalObject<T>>();
            for (let y = 0; y < gridHeight; y++) {
                columnMap.set(y, new ListPhysicalObject<T>());
            }
            this.matrix.set(x, columnMap);
        }
    }

    hasPosition(position: Coordonate): boolean {
        return this.matrix.has(position.x) && this.matrix.get(position.x).has(position.y);
    }

    extend(scale: number) {
        for (let x = -scale; x < this.matrixHeight + scale; x++) {
            if(!this.matrix.has(x)) this.matrix.set(x, new Map<number, ListPhysicalObject<T>>());
            for(let y = -scale;  y < this.matrixHeight + scale; y++) {
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

    getAround(position: Position, colidingParameters?: ColidingParameters) {

        let listColidingObjects = [];
        let minX = (position.gridPosition.x - 1 >= 0) ? position.gridPosition.x - 1 : 0;
        let maxX = (position.gridPosition.x + 1 <= this.matrixWidth) ? position.gridPosition.x + 1 : this.matrixWidth;

        let minY = (position.gridPosition.y - 1 >= 0) ? position.gridPosition.y - 1 : 0;
        let maxY = (position.gridPosition.y + 1 <= this.matrixHeight) ? position.gridPosition.y + 1 : this.matrixHeight;
        
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
        let gridX = (position) ? position.x : object.position.gridPosition.x;
        let gridY = (position) ? position.y : object.position.gridPosition.y;
        this.matrix.get(gridX).get(gridY).push(object);
    }

    remove(object: T, position?: {x: number, y: number}) {
        let gridX = (position) ? position.x : object.position.gridPosition.x;
        let gridY = (position) ? position.y : object.position.gridPosition.y;
        this.matrix.get(gridX).get(gridY).remove(object);
    }

    move(object: T, oldPosition: Position, newPosition: Position) {
        if(oldPosition.gridPosition != newPosition.gridPosition) {
            this.remove(object, oldPosition.gridPosition);
            this.push(object, newPosition.gridPosition);
        }
    }
}
