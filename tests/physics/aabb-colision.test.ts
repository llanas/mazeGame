import '../../src/physics/objects/physical-circle';
import PhysicalCircle from '../../src/physics/objects/physical-circle';
import { CONST_COLIDING_PARAMETERS } from '../../src/physics/utils/physical-parameters';
import Vector from '../../src/physics/utils/physical-vector';
import PhysicalRectangle from '../../src/physics/objects/physical-rectangle';
import AABBColision from '../../src/physics/colision/aabb-colision';
import { Position } from '../../src/physics/utils/physical-tools';

let aabbColider = new AABBColision();

const SHOULD_NOT_COLIDE = 'shouldNotColide';
const SHOULD_NOT_COLIDE_LENGTH = 'shouldNotColide';
const SHOULD_COLIDE = 'shouldColide';
const SHOULD_COLIDE_LENGTH = 'shouldColideLength';
const SHOULD_EXACT_COLIDE = 'shouldExactColide';
const SHOULD_COLIDE_ON_X = 'shouldColideOnX';
const SHOULD_COLIDE_ON_Y = 'shouldColideOnY';
const SHOULD_COLIDE_ON_BOTH_X_AND_Y = 'shouldColideOnBothXAndY';


/**
 * POINT AND CIRCLE
 */
describe('checkPointAndCircleColision_noColision', () => {
    let point = new Vector(0, 0);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndCircleColision(point, circle);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkPointAndCircleColision_exactColision', () => {
    let point = new Vector(1, 0);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndCircleColision(point, circle);
    it(SHOULD_EXACT_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkPointAndCircleColision_colision', () => {
    let point = new Vector(1, 1);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndCircleColision(point, circle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

/*
 * RAY & CIRCLE
 */
describe('checkRayAndCircleColision_noColision', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(3, 0), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toEqual(false, `${movingOutVector} should be false`) })
})

describe('checkRayAndCircleColision_noColisionLength', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(5, 3), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it(SHOULD_NOT_COLIDE_LENGTH, () => { expect(movingOutVector).toEqual(false, `${movingOutVector} should be false`) })
})

describe('checkRayAndCircleColision_noColisionLength_secure', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(4, 2), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it(SHOULD_NOT_COLIDE_LENGTH, () => { expect(movingOutVector).toEqual(false, `${movingOutVector} should be false`) })
})

describe('checkRayAndCircleColision_colisionStart', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRayAndCircleColision_colision', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(4, 2), 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRayAndCircleColision_colisionLength', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(5, 3), 3, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it(SHOULD_COLIDE_LENGTH, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

/**
 * CIRCLE & CIRCLE
 */
describe('checkCircleColision_noColision', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(3, 1), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkCirclesColision(circleA, circleB);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkCircleColision_exactColision', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(3, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkCirclesColision(circleA, circleB);
    it(SHOULD_EXACT_COLIDE, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkCircleColision_colisionX', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(2, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkCirclesColision(circleA, circleB);
    it(SHOULD_COLIDE_ON_X, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkCircleColision_colisionY', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(1, 2), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkCirclesColision(circleA, circleB);
    it(SHOULD_COLIDE_ON_Y, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

/**
 * POINT & RECTANGLE
 */
describe('checkPointAndRectangleColision_noColision', () => {
    let point = new Vector(0, 0);
    let rectangle = new PhysicalRectangle(new Vector(1, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndRectangleColision(point, rectangle);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkPointAndRectangleColision_exactColision', () => {
    let point = new Vector(1, 1);
    let rectangle = new PhysicalRectangle(new Vector(1, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndRectangleColision(point, rectangle);
    it(SHOULD_EXACT_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkPointAndRectangleColision_colision', () => {
    let point = new Vector(2, 2);
    let rectangle = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndRectangleColision(point, rectangle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

/**
 * RECTANGLE & RECTANGLE
 */
describe('checkRectanglesColision_noColision', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(3, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkRectanglesColision_exactColision', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(3, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it(SHOULD_EXACT_COLIDE, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRectanglesColision_colisionX', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(2, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it(SHOULD_COLIDE_ON_X, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRectanglesColision_colisionY', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(1, 2), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it(SHOULD_COLIDE_ON_Y, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRectanglesColision_colisionXAndY', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(2, 2), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it(SHOULD_COLIDE_ON_BOTH_X_AND_Y, () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

/**
 * RECTANGLE & CIRCLE
 */
describe('checkRectangleAndCircleColision_noColision', () => {
    let rect = new PhysicalRectangle(new Vector(1, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(1, -1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkRectangleAndCircleColision_noColision_B', () => {
    let rect = new PhysicalRectangle(new Vector(2, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(1, 0), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_NOT_COLIDE, () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be true`) })
})

describe('checkRectangleAndCircleColision_exactColision', () => {
    let rect = new PhysicalRectangle(new Vector(1, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(3, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_EXACT_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkRectangleAndCircleColision_exactColision_reverse', () => {
    let rect = new PhysicalRectangle(new Vector(2, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_EXACT_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

// Those tests are based on : http://sdz.tdct.org/sdz/eorie-des-collisions.html#CollisionAABB
describe('checkRectangleAndCircleColision_noColision_A', () => {
    let rect = new PhysicalRectangle(new Vector(2, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(1.5, 0.5), 1.5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkRectangleAndCircleColision_Colision_C', () => {
    let rect = new PhysicalRectangle(new Vector(0, 0), 3, 3, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(1.5, 1.5), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkRectangleAndCircleColision_Colision_D', () => {
    let rect = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(2, 2), 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkRectangleAndCircleColision_Colision_E', () => {
    let rect = new PhysicalRectangle(new Vector(2, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circle = new PhysicalCircle(new Vector(1.5, 2), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectangleAndCircleColision(rect, circle);
    it(SHOULD_COLIDE, () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})