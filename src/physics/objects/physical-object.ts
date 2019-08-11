import { Position, Coordonate } from "../utils/physical-tools";
import Vector from "./physical-vector";
import { ObjectRenderer } from "../../renderer/object-renderer";

export class PhysicalObject {
    

    public static listMovableObjects: PhysicalObject[] = [];
    public static listColidingObjects: PhysicalObject[] = [];
    public static gridObjects: PhysicalObject[][][] = [];

    public static buildGridObjects(_gridWidth: number, _gridheight: number) {
        for (let x = 0; x < _gridWidth + 1; x++) {
            let colomnGrid: PhysicalObject[][] = [];
            for (let y = 0; y < _gridheight + 1; y++) {
                let gridCaseObjects: PhysicalObject[] = []
                colomnGrid.push(gridCaseObjects);
            }
            PhysicalObject.gridObjects.push(colomnGrid);
        }
    }

    static getListColidingsObjects(gridPosition: Coordonate): PhysicalObject[] {

        let minX = (gridPosition.x - 1 >= 0) ? gridPosition.x - 1 : 0;
        let maxX = (gridPosition.x + 1 <= PhysicalObject.gridObjects.length) ? gridPosition.x + 1 : PhysicalObject.gridObjects.length;

        let minY = (gridPosition.y - 1 >= 0) ? gridPosition.y - 1 : 0;
        let maxY = (gridPosition.y + 1 <= PhysicalObject.gridObjects[0].length) ? gridPosition.y + 1 : PhysicalObject.gridObjects[0].length;
        
        let listColidingObjects = [];
        for (let x = minX; x <= maxX; x++) {
            if(PhysicalObject.gridObjects[x] == undefined) continue;
            for (let y = minY; y <= maxY; y++) {
                if(PhysicalObject.gridObjects[x][y] == undefined) continue;
                for (let i = 0; i < PhysicalObject.gridObjects[x][y].length; i++) {
                    if(PhysicalObject.gridObjects[x][y][i].coliding) {
                        listColidingObjects.push(PhysicalObject.gridObjects[x][y][i]);
                    }
                }
            }
        }
        return listColidingObjects;       
    }

    static moveObjectToAnotherGridPosition(oldPosition: Position, object: PhysicalObject) {
        PhysicalObject.deleteObjectFromGridPositionObjects(object, oldPosition);
        PhysicalObject.gridObjects[object.position.gridPosition.x][object.position.gridPosition.y].push(object);
    }

    static deleteObjectFromGridPositionObjects(object: PhysicalObject, oldPosition?: Position) {
        let position = (oldPosition) ? oldPosition : object.position;
        let oldGridPositionObjects = PhysicalObject.gridObjects[position.gridPosition.x][position.gridPosition.y];
        let indexInGridPositionObjects = oldGridPositionObjects.indexOf(object);
        if(indexInGridPositionObjects != -1) {
            oldGridPositionObjects.splice(indexInGridPositionObjects, 1);
        }
    }

    position: Position;
    movable: boolean;
    coliding: boolean;

    protected sliding: boolean = false;
    protected destroyOnColision: boolean = false;
    protected movingVector: Vector | null;

    protected _renderer: ObjectRenderer;
    public get renderer(): ObjectRenderer {
        return this._renderer;
    }
    public set renderer(renderer: ObjectRenderer) {
        this._renderer = renderer;
    }

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _renderer: ObjectRenderer = ObjectRenderer.defaultRenderer()) {
        this.position = _position;
        this.movable = _movable;
        this.coliding = _coliding;
        this._renderer = _renderer;

        if(this.movable) {
            PhysicalObject.listMovableObjects.push(this);
        } 
        if(this.coliding) {
            PhysicalObject.listColidingObjects.push(this);
            PhysicalObject.gridObjects[this.position.gridPosition.x][this.position.gridPosition.y].push(this);
        }
    }

    move(movingVector: Vector = this.movingVector) {
        if(this.movable) {
            if(movingVector != null) {
                let oldPosition = this.position;
                this.position.move(movingVector);
                if(oldPosition.gridPosition != this.position.gridPosition) {
                    PhysicalObject.moveObjectToAnotherGridPosition(oldPosition, this);
                }
            }
        }
    }

    checkCollision(object: PhysicalObject, newPosition: Coordonate): boolean {
        return (newPosition.x === object.position.x || newPosition.y === object.position.y);
    }

    destroy() {
        if(this.coliding) {
            PhysicalObject.listColidingObjects.splice(PhysicalObject.listColidingObjects.indexOf(this));
            PhysicalObject.deleteObjectFromGridPositionObjects(this);
        }
        if(this.movable) {
            PhysicalObject.listMovableObjects.splice(PhysicalObject.listMovableObjects.indexOf(this));
        }
    }
}