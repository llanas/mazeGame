import { Position, Coordonate } from "../utils/physical-tools";
import Vector from "./physical-vector";

export default class PhysicalObject {
    

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
            for (let y = minY; y <= maxY; y++) {
                for (let i = 0; i < PhysicalObject.gridObjects[x][y].length; i++) {
                    if(PhysicalObject.gridObjects[x][y][i].coliding) {
                        listColidingObjects.push(PhysicalObject.gridObjects[x][y][i]);
                    }
                }
            }
        }
        return listColidingObjects;       
    }

    position: Position;
    movable: boolean;
    coliding: boolean;
    sliding: boolean = false;

    constructor(_position: Position, _movable: boolean, _coliding: boolean, _sliding?: boolean) {
        this.position = _position;
        this.movable = _movable;
        this.coliding = _coliding;
        this.sliding = _sliding;

        if(this.movable) {
            PhysicalObject.listMovableObjects.push(this);
        } else if(this.coliding) {
            PhysicalObject.listColidingObjects.push(this);
            PhysicalObject.gridObjects[this.position.gridPosition.x][this.position.gridPosition.y].push(this);
        }
    }

    move(movingVector: Vector) {
        if(this.movable) {
        }
    }

    checkCollision(object: PhysicalObject, newPosition: Coordonate): boolean {
        return (newPosition.x === object.position.x || newPosition.y === object.position.y);
    }
}