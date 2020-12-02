import { Utils } from '../../utils/utils';
import PhysicalCircle from '../objects/physical-circle';
import { PhysicalObject } from '../objects/physical-object';
import PhysicalRectangle from '../objects/physical-rectangle';
import { CONST_COLIDING_PARAMETERS } from '../utils/physical-parameters';
import Vector from '../utils/physical-vector';
import { IColision } from './colision-interface';

export default class AABBColision implements IColision {

    checkPointColision(point: Vector, object: PhysicalObject) {
        if (object instanceof PhysicalCircle) {
            return this.checkPointAndCircleColision(point, object);
        } else if (object instanceof PhysicalRectangle) {
            return this.checkPointAndRectangleColision(point, object);
        }
    }

    checkRayColision(rayPosition: Vector, rayVector: Vector, object: PhysicalObject) {
        if (object instanceof PhysicalCircle) {
            return this.checkRayAndCircleColision(rayPosition, rayVector, object);
        } else if (object instanceof PhysicalRectangle) {
            return this.checkRayAndRectangleColision(rayPosition, rayVector, object);
        }
    }

    checkColision(objectA: PhysicalObject, objectB: PhysicalObject) {
        if (objectA instanceof PhysicalCircle) {
            if (objectB instanceof PhysicalCircle) {
                return this.checkCirclesColision(objectA, objectB);
            } else if (objectB instanceof PhysicalRectangle) {
                return this.checkRectangleAndCircleColision(objectB, objectA)
            }
        } else if (objectA instanceof PhysicalRectangle) {
            if (objectB instanceof PhysicalCircle) {
                return this.checkRectangleAndCircleColision(objectA, objectB)
            } else if (objectB instanceof PhysicalRectangle) {
                return this.checkRectanglesColision(objectA, objectB);
            }
        }
    }

    checkPointAndCircleColision(point: Vector, circle: PhysicalCircle): boolean {
        return Math.abs(circle.position.clone().subtract(point).length) <= circle.radius;
    }

    checkPointAndRectangleColision(point: Vector, rect: PhysicalRectangle): boolean {
        return (point.x >= rect.position.x
            && point.x < rect.position.x + rect.width
            && point.y >= rect.position.y
            && point.y < rect.position.y + rect.height);
    }

    checkRayAndCircleColision(rayPosition: Vector, rayVector: Vector, circle: PhysicalCircle): boolean {
        if (this.checkPointAndCircleColision(rayPosition, circle)) return true;
        let relativeCirclePosition = circle.center.clone().subtract(rayPosition);
        // Project circle center on the
        let closestPointOnRay = relativeCirclePosition.clone().projectOnto(rayVector);
        if (closestPointOnRay.length > rayVector.length + circle.radius) return false;
        return Math.abs(relativeCirclePosition.clone().subtract(closestPointOnRay).length) <= circle.radius;
    }

    checkRayAndRectangleColision(rayPosition: Vector, rayVector: Vector, rectangle: PhysicalRectangle): boolean {
        const nearestPointX = (rectangle.position.x - rayPosition.x) / rayVector.length;
        const farestPointX = (rectangle.position.x + rectangle.width - rayPosition.x) / rayVector.length;

        const nearestPointY = (rectangle.position.y - rayPosition.y) / rayVector.length;
        const farestPointY = (rectangle.position.y + rectangle.height - rayPosition.y) / rayVector.length;

        if (nearestPointX > farestPointX) Utils.swapObject(nearestPointX, farestPointX);
        if (nearestPointY > farestPointY) Utils.swapObject(nearestPointY, farestPointY);

        if (nearestPointX > farestPointY || nearestPointY > farestPointX) return false;

        const nearestHit = Math.max(nearestPointX, nearestPointY);
        const farestHit = Math.min(farestPointX, farestPointY);

        if (farestHit < 0) return false;
        return true;
    }

    checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle): boolean {
        return Math.abs(circleB.position.clone().subtract(circleA.position).length) <= circleA.radius + circleB.radius;
    }

    checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle): boolean {
        return (rectA.position.x <= rectB.position.x + rectB.width &&
            rectA.position.x + rectA.width >= rectB.position.x &&
            rectA.position.y <= rectB.position.y + rectB.height &&
            rectA.position.y + rectA.height >= rectB.position.y);
    }

    checkRectangleAndCircleColision(rect: PhysicalRectangle, circle: PhysicalCircle): boolean {

        // 1 - Cast circle into rectangle and test rectangle Colision
        const circleCastIntoRectangle = new PhysicalRectangle(
            new Vector(circle.center.x - circle.radius, circle.center.y - circle.radius),
            circle.radius * 2, circle.radius * 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);

        if (!this.checkRectanglesColision(circleCastIntoRectangle, rect)) {
            return false;
        }

        // 2 - check every rectangle corner and circle
        for (let corner of rect.getAllCorners()) {
            if (this.checkPointAndCircleColision(corner, circle)) {
                return true;
            }
        }

        // 3 - Check AABB and circle center
        if (this.checkPointAndRectangleColision(circle.center, rect)) {
            return true;
        }

        // 4 - check projection of circle center into both rectangle segments
        // Knowing that there is no rotation for the moment, we can project onto orthogonale x and y
        if (circle.center.x >= rect.position.x && circle.center.x <= (rect.position.x + rect.width)
            || circle.center.y >= rect.position.y && circle.center.y <= (rect.position.y + rect.height)) {
            return true;
        }
        return false;
    }

    solveColision(objectA: PhysicalObject, objectB: PhysicalObject) {
        if (objectA.colidingParameters.movable && !objectB.colidingParameters.movable) {
            // A is movable and B not

        } else if (!objectA.colidingParameters.movable && objectB.colidingParameters.movable) {
            // B is movable and A not

        } else {
            // Both A and B are movable...
        }
    }
}