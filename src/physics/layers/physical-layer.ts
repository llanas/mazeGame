import { Drawer } from "../../renderer/drawer";
import { PhysicalMatrix } from "../utils/physical-matrix";
import { PhysicalObject } from "../objects/physical-object";
import { ListPhysicalObject } from "../utils/physical-tools";
import { CONST_COLIDING_PARAMETERS } from "../utils/physical-parameters";
import Vector from "../objects/physical-vector";
import { Colision, ColisionResult } from "../utils/physical-colision";

export class PhysicalLayer {

    public drawer: Drawer;
    public matrix: PhysicalMatrix<PhysicalObject>;
    protected listMovableObject: ListPhysicalObject<PhysicalObject> = new ListPhysicalObject();

    constructor(_matrixScaleWidth: number, _matrixScaleHeight: number, drawer: Drawer) {
        this.matrix = new PhysicalMatrix(_matrixScaleWidth, _matrixScaleHeight);
        this.drawer = drawer;
    }

    moveAll(...colidingLayers: PhysicalLayer[]) {
        for (let i = 0; i < this.listMovableObject.length; i++) {
            const movingObject = this.listMovableObject[i];
            if(movingObject.movingVector != null && !movingObject.movingVector.isZero()) {
                // let positionAfterMove = movingObject.getPositionAfterMove();
                movingObject.move();
                let listColidingObjects: PhysicalObject[] = [];
                for (let y = 0; y < colidingLayers.length; y++) {
                    // listColidingObjects.push(... colidingLayers[y].getColidingObjects(movingObject, positionAfterMove));
                    let colidingResult = colidingLayers[y].getColidingObjects(movingObject);
                    if(colidingResult != null && colidingResult.isColiding) {
                        movingObject.move(colidingResult.outVector);
                    }
                }
                // if(listColidingObjects.length != 0) {
                //     for (let z = 0; z < listColidingObjects.length; z++) {
                //         if(listColidingObjects[z].checkCollision(movingObject, movingObject.getPositionAfterMove())) {
                //             movingObject.colidingWith(listColidingObjects[z]);
                //         }
                //     }
                // }
                // this.move(movingObject);
            }
        }
    }

    getColidingObjects(object: PhysicalObject): ColisionResult | null {
        let objectsColidingWith: PhysicalObject[] = [];
        let listColidingObject = this.matrix.getAround(object.position, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
        for (let i = 0; i < listColidingObject.length; i++) {
            let colidingResult = Colision.checkColision(listColidingObject[i], object);
            // if(object.checkCollision(listColidingObject[i], newPosition)) {
            //     objectsColidingWith.push(listColidingObject[i]);
            // }
            if(colidingResult != undefined && colidingResult.isColiding) {
                return colidingResult;
            }
        }
        return null;
    }

    move(object: PhysicalObject) {
        if(object.movingVector != null && !object.movingVector.isZero()) {
            let positionAfterMove = object.getPositionAfterMove();
            if(!this.matrix.hasPosition(this.matrix.getMatrixPositionByScale(positionAfterMove))) {
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