import PhysicalCircle from '../objects/physical-circle';
import PhysicalRectangle from '../objects/physical-rectangle';
import Vector from '../utils/physical-vector';

export interface IColision {

    // Point
    checkPointAndCircleColision(point: Vector, circle: PhysicalCircle): boolean;
    checkPointAndRectangleColision(point: Vector, rect: PhysicalRectangle): boolean;

    // Ray
    checkRayAndCircleColision(rayPosition: Vector, rayVector: Vector, circle: PhysicalCircle): boolean;

    // Circle
    checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle): boolean;
    checkRectangleAndCircleColision(rect: PhysicalRectangle, circle: PhysicalCircle): boolean;

    // Rectangle
    checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle): boolean;
}