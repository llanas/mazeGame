import PhysicalCircle from '../objects/physical-circle';
import PhysicalRectangle from '../objects/physical-rectangle';
import Vector from '../objects/physical-vector';
import { Position } from '../utils/physical-tools';
import { IColision } from './colision-interface';

export default class AABBColision implements IColision {

    checkPointAndCircleColision(point: Vector, circle: PhysicalCircle): boolean {
        return Math.abs(circle.position.clone().subtract(point).length) <= circle.radius;
    }

    checkRayAndCircleColision(rayPosition: Vector, rayVector: Vector, circle: PhysicalCircle): boolean {
        if (this.checkPointAndCircleColision(rayPosition, circle)) return true;
        let relativeCirclePosition = circle.position.clone().subtract(rayPosition);
        // Project circle center on the
        let closestPointOnRay = relativeCirclePosition.clone().projectOnto(rayVector);
        if (closestPointOnRay.length > rayVector.length + circle.radius) return false;
        return Math.abs(relativeCirclePosition.subtract(closestPointOnRay).length) <= circle.radius;
    }

    checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle): boolean {
        return Math.abs(circleB.position.subtract(circleA.position).length) <= circleA.radius + circleB.radius;
    }

    checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle): boolean {
        return (rectA.position.x <= rectB.position.x + rectB.width &&
            rectA.position.x + rectA.width >= rectB.position.x &&
            rectA.position.y <= rectB.position.y + rectB.height &&
            rectA.position.y + rectA.height >= rectB.position.y);
    }

    // checkRectangleAndCircleColision(rect: PhysicalRectangle, circle: PhysicalCircle): Vector | null {
    //     // 1 - Check outbond rectangle Circle
    //     let halfWidth = rect.width / 2;
    //     let halfHeight = rect.height / 2;
    //     let xCircleDistance = Math.abs(circle.position.x - (rect.center.x - halfWidth));
    //     let yCircleDistance = Math.abs(circle.position.y - (rect.center.y - halfHeight));

    //     if (xCircleDistance > (halfWidth + circle.radius)) return null;
    //     if (yCircleDistance > (halfHeight + circle.radius)) return null;

    //     if (xCircleDistance <= halfWidth) return null;
    //     if (yCircleDistance <= halfHeight) return null;

    //     let cornerDistanceSqrt = Math.sqrt(xCircleDistance - halfWidth) + Math.sqrt(yCircleDistance - halfHeight);
    //     if (cornerDistanceSqrt > Math.sqrt(circle.radius)) {
    //         return null;
    //     } else {
    //         // Colision detected
    //         let separatingVector = rect.center.subtract(circle.center);
    //         let xProjection = separatingVector.projectOnto(new Vector(1, 0));
    //         let yProjection = separatingVector.projectOnto(new Vector(0, 1));
    //         return (xProjection.length >= yProjection.length) ? yProjection : xProjection;
    //     }
    // }
}