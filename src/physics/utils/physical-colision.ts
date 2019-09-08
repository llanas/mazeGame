import { PhysicalObject } from "../objects/physical-object";
import Vector from "../objects/physical-vector";
import PhysicalCircle from "../objects/physical-circle";
import PhysicalRectangle from "../objects/physical-rectangle";

export class Colision {

    private constructor() {}

    static checkColision(objectA: PhysicalObject, objectB: PhysicalObject): ColisionResult {

        if(objectA instanceof PhysicalCircle) {
            if(objectB instanceof PhysicalCircle) {
                Colision.checkCirclesColision(objectA, objectB);
            } else {
                Colision.checkRectangleAndCircleColision(objectB, objectA)
            }
        } else if(objectA instanceof PhysicalRectangle) {
            if(objectB instanceof PhysicalCircle) {
                Colision.checkRectangleAndCircleColision(objectA, objectB)
            } else {
                Colision.checkRectanglesColision(objectA, objectB);
            }
        }
        let listNormalsToProject = [];
        listNormalsToProject.push(...objectA.normals)
        listNormalsToProject.push(...objectB.normals)

        return new ColisionResult(false, new Vector());
    }

    static checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle): ColisionResult {
        let separatingVector = new Vector(circleB.center.x, circleB.center.y).subtract(new Vector(circleA.center.x, circleA.center.y));
        if(separatingVector.length <= circleA.radius + circleB.radius) {
            return new ColisionResult(true, separatingVector);
        } else {
            return new ColisionResult();
        }
    }

    static checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle) {
        let listPojectionVectors = [...rectA.normals, ...rectB.normals];
        for (let i = 0; i < listPojectionVectors.length; i++) {
            const projectionVector = listPojectionVectors[i];
            
        }
    }
    
}

export class ColisionResult {

    isColiding: boolean;
    outVector: Vector;

    constructor(_isColiding: boolean = false, _outVector: Vector = new Vector(0, 0)) {
        this.isColiding = _isColiding;
        this.outVector = _outVector;
    }
}