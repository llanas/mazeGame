import { PhysicalObject } from "../objects/physical-object";
import Vector from "../objects/physical-vector";
import PhysicalCircle from "../objects/physical-circle";
import PhysicalRectangle from "../objects/physical-rectangle";

export class Colision {

    private constructor() {}

    static checkColision(objectA: PhysicalObject, objectB: PhysicalObject) {

        if(objectA instanceof PhysicalCircle) {
            if(objectB instanceof PhysicalCircle) {
                Colision.checkCirclesColision(objectA, objectB);
            } else if(objectB instanceof PhysicalRectangle) {
                Colision.checkRectangleAndCircleColision(objectB, objectA)
            }
        } else if(objectA instanceof PhysicalRectangle) {
            if(objectB instanceof PhysicalCircle) {
                Colision.checkRectangleAndCircleColision(objectA, objectB)
            } else if(objectB instanceof PhysicalRectangle) {
                Colision.checkRectanglesColision(objectA, objectB);
            }
        }
    }

    static checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle) {
        let separatingVector = new Vector(circleB.center.x, circleB.center.y).subtract(new Vector(circleA.center.x, circleA.center.y));
        if(separatingVector.length <= circleA.radius + circleB.radius) {
            Colision.colide(circleA, circleB, separatingVector);
        }
    }

    static checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle) {
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
        let rectToCircleV = circle.center.subtract(rect.center);
        let rectToCircleVNorm = rectToCircleV.clone().normalize();
        let maxProjection = new Vector();
        rect.getAllCorners().forEach(corner => {
            let centerToCornerV = corner.subtract(rect.center);
            let projectedVector = centerToCornerV.multiply(rectToCircleVNorm);
            if(projectedVector.length > maxProjection.length) {
                maxProjection = projectedVector;
            }
        })
        if(rectToCircleV.length - maxProjection.length - circle.radius > 0 && rectToCircleV.length > 0) {
        } else {
            Colision.colide(rect, circle, maxProjection.subtract(circle.center));
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
