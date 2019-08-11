import { Drawer } from "../../renderer/drawer";
import { PhysicalMatrix } from "../utils/physical-matrix";
import { PhysicalObject } from "../objects/physical-object";
import { Position, ListPhysicalObject } from "../utils/physical-tools";
import { CONST_COLIDING_PARAMETERS } from "../utils/physical-parameters";

export class PhysicalLayer {

    public drawer: Drawer;
    public matrix: PhysicalMatrix<PhysicalObject>;
    protected listMovableObject: ListPhysicalObject<PhysicalObject> = new ListPhysicalObject();

    constructor(gridWidth: number, gridHeight: number, drawer: Drawer) {
        this.matrix = new PhysicalMatrix(gridWidth, gridHeight);
        this.drawer = drawer;
    }

    moveAll(...colidingLayers: PhysicalLayer[]) {
        for (let i = 0; i < this.listMovableObject.length; i++) {
            const movingObject = this.listMovableObject[i];
            if(movingObject.movingVector != null && !movingObject.movingVector.isZero()) {
                let positionAfterMove = movingObject.getPositionAfterMove();
                
                let listColidingObjects: PhysicalObject[] = [];
                for (let y = 0; y < colidingLayers.length; y++) {
                    listColidingObjects.push(... colidingLayers[y].getColidingObjects(movingObject, positionAfterMove));
                }
                if(listColidingObjects.length != 0) {
                    for (let z = 0; z < listColidingObjects.length; z++) {
                        if(listColidingObjects[z].checkCollision(movingObject, movingObject.getPositionAfterMove())) {
                            movingObject.colidingWith(listColidingObjects[z]);
                        }
                    }
                }
                this.move(movingObject);
            }
        }
    }

    getColidingObjects(object: PhysicalObject, newPosition: Position): PhysicalObject[] {
        let objectsColidingWith: PhysicalObject[] = [];
        let listColidingObject = this.matrix.getAround(newPosition, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
        for (let i = 0; i < listColidingObject.length; i++) {
            if(object.checkCollision(listColidingObject[i], newPosition)) {
                objectsColidingWith.push(listColidingObject[i]);
            }
        }
        return objectsColidingWith;
    }

    move(object: PhysicalObject) {
        if(object.movingVector != null && !object.movingVector.isZero()) {
            let positionAfterMove = object.getPositionAfterMove();
            if(!this.matrix.hasPosition(positionAfterMove.gridPosition)) {
                object.destroy();
            } else {
                this.matrix.move(object, object.position, positionAfterMove);
                object.move();
            }
        }
    }

    add(object: PhysicalObject) {
        if(object.colidingParameters.movable) {
            this.listMovableObject.push(object);
        }
        object.layer = this;
        this.matrix.push(object);
    }

    remove(object: PhysicalObject) {
        if(object.colidingParameters.movable) {
            this.listMovableObject.remove(object);
        }
        this.matrix.remove(object);
    }

    render(): void {
        let listPhysicalObjects = this.matrix.getAll();
        for (let index = 0; index < listPhysicalObjects.length; index++) {
            this.drawer.drawPhysicalObject(listPhysicalObjects[index]);
        }
    }
}