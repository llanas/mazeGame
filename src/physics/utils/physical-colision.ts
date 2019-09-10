import { PhysicalObject } from "../objects/physical-object";
import Vector from "../objects/physical-vector";
import PhysicalCircle from "../objects/physical-circle";
import PhysicalRectangle from "../objects/physical-rectangle";

export class Colision {

    private constructor() {}

    static checkColision(objectA: PhysicalObject, objectB: PhysicalObject): ColisionResult {

        let colisionResult: ColisionResult;
        if(objectA instanceof PhysicalCircle) {
            if(objectB instanceof PhysicalCircle) {
                colisionResult = Colision.checkCirclesColision(objectA, objectB);
            } else if(objectB instanceof PhysicalRectangle) {
                colisionResult = Colision.checkRectangleAndCircleColision(objectB, objectA)
            }
        } else if(objectA instanceof PhysicalRectangle) {
            if(objectB instanceof PhysicalCircle) {
                colisionResult = Colision.checkRectangleAndCircleColision(objectA, objectB)
            } else if(objectB instanceof PhysicalRectangle) {
                colisionResult = Colision.checkRectanglesColision(objectA, objectB);
            }
        }

        return colisionResult;
    }

    static checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle) {
        let separatingVector = new Vector(circleB.center.x, circleB.center.y).subtract(new Vector(circleA.center.x, circleA.center.y));
        if(separatingVector.length <= circleA.radius + circleB.radius) {
            Colision.colide(circleA, circleB, separatingVector);
        }
    }

    static checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle): ColisionResult {
        let listPojectionVectors = [...rectA.normals, ...rectB.normals];

        listPojectionVectors.push(rectB.center.subtract(rectA.center));
        let rectACorners = rectA.getAllCorners().map(corner => corner.subtract(rectA.center));
        let rectBCorners = rectB.getAllCorners().map(corner => corner.subtract(rectB.center));;
        
        let minVectorOut: Vector;

        for (let i = 0; i < listPojectionVectors.length; i++) {
            const projectionVector = listPojectionVectors[i];
            let minRectA = rectACorners[0], minRectB = rectBCorners[0], maxRectA = rectACorners[0], maxRectB = rectBCorners[0];
            rectACorners.forEach(corner => {
                let projectedVector = corner.projectOnto(projectionVector)
                if(projectedVector.length < minRectA.length) {
                    minRectA = projectedVector;
                }
                if(projectedVector.length > maxRectA.length) {
                    maxRectA = projectedVector;
                }
            })
            rectBCorners.forEach(corner => {
                let projectedVector = corner.projectOnto(projectionVector)
                if(projectedVector.length < minRectB.length) {
                    minRectB = projectedVector;
                }
                if(projectedVector.length > maxRectB.length) {
                    maxRectB = projectedVector;
                }
            })
            if(minRectB.length - maxRectA.length <= 0) {
                let vectorOut = minRectB.subtract(maxRectA);
                if(vectorOut.length < minVectorOut.length) {
                    minVectorOut = vectorOut;
                }
                minVectorOut = maxRectA.subtract(minRectB);
            } else if(minRectA.length - maxRectB.length <= 0) {
                let vectorOut = maxRectB.subtract(minRectA);
                if(vectorOut.length < minVectorOut.length) {
                    minVectorOut = vectorOut;
                }
            }
        }
        if(minVectorOut != null) {
            Colision.colide(rectA, rectB, minVectorOut);
        }
    }

    
    static checkRectangleAndCircleColision(rect: PhysicalRectangle, circle: PhysicalCircle) {
        let centerVector = rect.center.subtract(circle.center);
        let maxCorner = new Vector();
        rect.getAllCorners().forEach(corner => {
            let projectedVector = corner.projectOnto(centerVector);
            if(projectedVector.length > maxCorner.length) {
                maxCorner = projectedVector;
            }
        })
        if(maxCorner.length - circle.radius <= 0) {
            Colision.colide(rect, circle, maxCorner.subtract(circle.center));
        }
    }

    static colide(objectA: PhysicalObject, objectB: PhysicalObject, separatingVectorAB: Vector) {
        if(objectA.colidingParameters.sliding && !objectA.movingVector.isZero() && objectB.colidingParameters.sliding && !objectB.movingVector.isZero()) {
            objectA.move(separatingVectorAB.scale(.5).invert());
            objectB.move(separatingVectorAB.scale(.5));
        } else if(objectA.colidingParameters.sliding && !objectA.movingVector.isZero()) {
            objectA.move(separatingVectorAB.invert());
        } else if(objectB.colidingParameters.sliding && !objectB.movingVector.isZero()) {
            objectB.move(separatingVectorAB.invert());
        }
        objectA.colidingWith(objectB);
        objectB.colidingWith(objectA);
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