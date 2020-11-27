import PhysicalCircle from '../objects/physical-circle';
import { PhysicalObject } from '../objects/physical-object';
import PhysicalRectangle from '../objects/physical-rectangle';
import { CONST_COLIDING_PARAMETERS } from '../utils/physical-parameters';
import Vector from '../utils/physical-vector';
import { IColision } from './colision-interface';

export default class AABBColision implements IColision {

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

    // checkRayAndRectangleColision(rayPosition: Vector, rayVector: Vector, circle: PhysicalCircle): boolean {
    //     if (this.checkPointAndCircleColision(rayPosition, circle)) return true;
    //     let relativeCirclePosition = circle.position.clone().subtract(rayPosition);
    //     // Project circle center on the
    //     let closestPointOnRay = relativeCirclePosition.clone().projectOnto(rayVector);
    //     if (closestPointOnRay.length > rayVector.length + circle.radius) return false;
    //     return Math.abs(relativeCirclePosition.clone().subtract(closestPointOnRay).length) <= circle.radius;
    // }

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
}