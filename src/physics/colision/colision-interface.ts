import PhysicalCircle from '../objects/physical-circle';
import PhysicalRectangle from '../objects/physical-rectangle';
import { Position } from '../utils/physical-tools';
import Vector from '../objects/physical-vector';

export interface IColision {

    checkPointAndCircleColision(point: Vector, circle: PhysicalCircle): boolean;
    checkRayAndCircleColision(rayPosition: Vector, rayVector: Vector, circle: PhysicalCircle): boolean
    checkCirclesColision(circleA: PhysicalCircle, circleB: PhysicalCircle): boolean;
    checkRectanglesColision(rectA: PhysicalRectangle, rectB: PhysicalRectangle): boolean;
    // checkRectangleAndCircleColision(rect: PhysicalRectangle, circle: PhysicalCircle): boolean;

}