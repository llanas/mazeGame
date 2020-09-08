import PhysicalCircle from '../objects/physical-circle';
import { PhysicalObject } from '../objects/physical-object';
import PhysicalRectangle from '../objects/physical-rectangle';
import Vector from '../objects/physical-vector';

export class Colision {

    private constructor () { }

    static checkColision(objectA: PhysicalObject, objectB: PhysicalObject) {

        let movingOutVector = null;
        if (objectA instanceof PhysicalCircle) {
            if (objectB instanceof PhysicalCircle) {
                movingOutVector = Colision.checkCirclesColision(objectA, objectB);
            } else if (objectB instanceof PhysicalRectangle) {
                movingOutVector = Colision.checkRectangleAndCircleColision(objectB, objectA)
            }
        } else if (objectA instanceof PhysicalRectangle) {
            if (objectB instanceof PhysicalCircle) {
                movingOutVector = Colision.checkRectangleAndCircleColision(objectA, objectB)
            } else if (objectB instanceof PhysicalRectangle) {
                movingOutVector = Colision.checkRectanglesColision(objectA, objectB);
            }
        }
        if (movingOutVector != null) {
            Colision.colide(objectA, objectB, movingOutVector);
        }
    }

    static checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle) {
        let separatingVector = new Vector(circleB.center.x, circleB.center.y).subtract(new Vector(circleA.center.x, circleA.center.y));
        if (separatingVector.length <= circleA.radius + circleB.radius) {
            return separatingVector;
        }
        return null;
    }

    static checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle): Vector | null {
        let listPojectionVectors = [...rectA.normals, ...rectB.normals];
        let minVectorOut = new Vector(Infinity, Infinity);

        listPojectionVectors.push(rectB.center.subtract(rectA.center));
        let rectACorners = rectA.getAllCorners().map(corner => corner.subtract(rectA.center));
        let rectBCorners = rectB.getAllCorners().map(corner => corner.subtract(rectB.center));;

        for (let i = 0; i < listPojectionVectors.length; i++) {
            const projectionVector = listPojectionVectors[i];
            let minRectA = rectACorners[0], minRectB = rectBCorners[0], maxRectA = rectACorners[0], maxRectB = rectBCorners[0];
            rectACorners.forEach(corner => {
                let projectedVector = corner.projectOnto(projectionVector)
                if (projectedVector.length < minRectA.length) {
                    minRectA = projectedVector;
                }
                if (projectedVector.length > maxRectA.length) {
                    maxRectA = projectedVector;
                }
            })
            rectBCorners.forEach(corner => {
                let projectedVector = corner.projectOnto(projectionVector)
                if (projectedVector.length < minRectB.length) {
                    minRectB = projectedVector;
                }
                if (projectedVector.length > maxRectB.length) {
                    maxRectB = projectedVector;
                }
            })
            if (minRectB.length - maxRectA.length <= 0) {
                let vectorOut = minRectB.subtract(maxRectA);
                if (vectorOut.length < minVectorOut.length) {
                    minVectorOut = vectorOut;
                }
                minVectorOut = maxRectA.subtract(minRectB);
            } else if (minRectA.length - maxRectB.length <= 0) {
                let vectorOut = maxRectB.subtract(minRectA);
                if (vectorOut.length < minVectorOut.length) {
                    minVectorOut = vectorOut;
                }
            }
        }
        return minVectorOut;
    }


    static checkRectangleAndCircleColision(rect: PhysicalRectangle, circle: PhysicalCircle): Vector | null {
        let movingOutVector = null;
        let rectToCircleV = circle.center.subtract(rect.center);
        let rectToCircleVNorm = rectToCircleV.clone().normalize();
        let max, maxProjection = new Vector();
        rect.getAllCorners().forEach(corner => {
            let centerToCornerV = corner.subtract(rect.center);
            let projectedVector = centerToCornerV.projectOnto(rectToCircleVNorm);
            if (projectedVector.length > maxProjection.length) {
                max = centerToCornerV;
                maxProjection = projectedVector;
            }
        })
        let penetrationDistance = rectToCircleV.length - maxProjection.length - circle.radius;
        if (penetrationDistance <= 0 || rectToCircleV.length <= 0) {
            let normals = rect.normals;
            let normalProjectionA = normals[0].clone().projectOnto(rectToCircleV);
            let normalProjectionB = normals[1].clone().projectOnto(rectToCircleV);
            if (normalProjectionA < normalProjectionB) {
                movingOutVector = maxProjection.projectOnto(normals[0]).normalize().scale(penetrationDistance);
            } else {
                movingOutVector = maxProjection.projectOnto(normals[1]).normalize().scale(penetrationDistance);
            }
        }
        return movingOutVector;
    }

    static colide(objectA: PhysicalObject, objectB: PhysicalObject, separatingVectorAB: Vector) {
        if (objectA.colidingParameters.sliding && !objectA.movingVector.isZero() && objectB.colidingParameters.sliding && !objectB.movingVector.isZero()) {
            objectA.move(separatingVectorAB.scale(.5));
            objectB.move(separatingVectorAB.scale(.5).invert());
        } else if (objectA.colidingParameters.sliding && !objectA.movingVector.isZero()) {
            objectA.move(separatingVectorAB);
        } else if (objectB.colidingParameters.sliding && !objectB.movingVector.isZero()) {
            objectB.move(separatingVectorAB);
        }
        // objectA.colidingWith(objectB);
        // objectB.colidingWith(objectA);
    }
}
