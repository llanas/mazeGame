import { Drawer } from '../../renderer/drawer';
import { PhysicalObject } from '../objects/physical-object';
import { Colision } from '../utils/physical-colision';
import { PhysicalMatrix } from '../utils/physical-matrix';
import { CONST_COLIDING_PARAMETERS } from '../utils/physical-parameters';
import { ListPhysicalObject } from '../utils/physical-tools';

/**
 * Physical Layer
 * 
 * A physical layer represent the zone where action take place
 * It is link to a @see Drawer to represent the layer
 * 
 * It has a function call @see moveAll() that can make move the list of movable objects
 * This funtion can have multiple other Physical layer as parameters to colide with
 */
export class PhysicalLayer {

    public drawer: Drawer;
    public matrix: PhysicalMatrix<PhysicalObject>;
    protected listMovableObject: ListPhysicalObject<PhysicalObject> = new ListPhysicalObject();

    /**
     * @param _matrixScaleWidth The width size of the matrix
     * @param _matrixScaleHeight The height size of the matrix
     * @param drawer the drawer linked
     */
    constructor (_matrixScaleWidth: number, _matrixScaleHeight: number, drawer: Drawer) {
        this.matrix = new PhysicalMatrix(_matrixScaleWidth, _matrixScaleHeight);
        this.drawer = drawer;
    }

    /**
     * Function that iterate throught all of the movableLayer of the Physical Layer and move them
     * It interact with the list of PhysicalLayer passed as parameters
     * 
     * @param colidingLayers list of Physical Layer to interact with
     */
    moveAll(...colidingLayers: PhysicalLayer[]) {
        for (let i = 0; i < this.listMovableObject.length; i++) {
            const movingObject = this.listMovableObject[i];
            if (movingObject.movingVector != null && !movingObject.movingVector.isZero()) {
                // let positionAfterMove = movingObject.getPositionAfterMove();
                movingObject.move();
                for (let y = 0; y < colidingLayers.length; y++) {
                    // listColidingObjects.push(... colidingLayers[y].getColidingObjects(movingObject, positionAfterMove));
                    colidingLayers[y].getColidingObjects(movingObject);
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

    /**
     * Function that check if the PhysicalObject passed in parameter is coliding with object of this layer.
     * To do so, it look up all the physical object set in the the matrix around the paramter position.
     * It returns every PhysicalObject that the parameter is coliding with.
     * 
     * @param object PhysicalObject to check if it is coliding with something inside this layer
     * 
     * @returns list of PhysicalObject that is coliding with the parameter
     */
    getColidingObjects(object: PhysicalObject) {
        let listOfObjectItColideWith = [];
        let listColidingObject = this.matrix.getAround(object.position, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
        for (let i = 0; i < listColidingObject.length; i++) {
            if (Colision.checkColision(listColidingObject[i], object)) {
                listOfObjectItColideWith.push(listColidingObject[i]);
            }
        }
        return listOfObjectItColideWith;
    }

    /**
     * Function that move object inside the matrix
     * If the position after movement is out of the matrix, it gets destroyed
     * Else the object change matrix position and the object is moved
     * 
     * @param object PhysicalObject to move
     */
    move(object: PhysicalObject) {
        if (object.movingVector != null && !object.movingVector.isZero()) {
            let positionAfterMove = object.getPositionAfterMove();
            if (!this.matrix.hasPosition(this.matrix.getMatrixPositionByScale(positionAfterMove))) {
                object.destroy();
            } else {
                this.matrix.move(object, object.position, positionAfterMove);
                object.move();
            }
        }
    }

    /**
     * Function that add a PhysicalObject to the layer.
     * If the object is movable, it is added to the list of movable object from the matrix
     * Then the object is added to the matrix
     * 
     * @param object PhysicalObject to add
     */
    add(object: PhysicalObject) {
        if (object.colidingParameters.movable) {
            this.listMovableObject.push(object);
        }
        object.layer = this;
        this.matrix.push(object);
    }

    /**
     * Function that remove a PhysicalObject from the layer
     * If it is movable it is also removed from the list of movable object
     * Then it is remove from the matrix
     * 
     * @param object PhysicalObject to remove
     */
    remove(object: PhysicalObject) {
        if (object.colidingParameters.movable) {
            this.listMovableObject.remove(object);
        }
        this.matrix.remove(object);
    }

    /**
     * Function that render the layer
     * It gets every object of the matrix and render them inside the Layer Drawer
     */
    render(): void {
        let listPhysicalObjects = this.matrix.getAll();
        for (let index = 0; index < listPhysicalObjects.length; index++) {
            this.drawer.drawPhysicalObject(listPhysicalObjects[index]);
        }
    }
}