import '../../src/physics/objects/physical-circle';
import PhysicalCircle from '../../src/physics/objects/physical-circle';
import { CONST_COLIDING_PARAMETERS } from '../../src/physics/utils/physical-parameters';
import Vector from '../../src/physics/objects/physical-vector';
import PhysicalRectangle from '../../src/physics/objects/physical-rectangle';
import AABBColision from '../../src/physics/colision/aabb-colision';
import { Position } from '../../src/physics/utils/physical-tools';

let aabbColider = new AABBColision();


// POINT AND CIRCLE
describe('checkPointAndCircleColision_noColision', () => {
    let point = new Vector(0, 0);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndCircleColision(point, circle);
    it('shouldNotColide', () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkPointAndCircleColision_exactColision', () => {
    let point = new Vector(1, 0);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndCircleColision(point, circle);
    it('shouldExactColide', () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

describe('checkPointAndCircleColision_colision', () => {
    let point = new Vector(1, 1);
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkPointAndCircleColision(point, circle);
    it('shouldColide', () => { expect(movingOutVector).toBe(true, `${movingOutVector} should be true`) })
})

// RAY AND CIRCLE
describe('checkRayAndCircleColision_noColision', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(3, 0), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it('shouldNotColide', () => { expect(movingOutVector).toEqual(false, `${movingOutVector} should be false`) })
})

describe('checkRayAndCircleColision_noColisionLength', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(5, 3), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it('shouldNotColideLength', () => { expect(movingOutVector).toEqual(false, `${movingOutVector} should be false`) })
})

describe('checkRayAndCircleColision_noColisionLength_secure', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(4, 2), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it('shouldNotColideLength', () => { expect(movingOutVector).toEqual(false, `${movingOutVector} should be false`) })
})

describe('checkRayAndCircleColision_colisionStart', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it('shouldNotColide', () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRayAndCircleColision_colision', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(4, 2), 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it('shouldColide', () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRayAndCircleColision_colisionLength', () => {
    let rayPosition = new Vector(1, 1)
    let rayVector = new Vector(2, 1)
    let circle = new PhysicalCircle(new Vector(5, 3), 3, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRayAndCircleColision(rayPosition, rayVector, circle);
    it('shouldColideLength', () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkCircleColision_noColision', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(3, 1), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkCirclesColision(circleA, circleB);
    it('shouldNotColide', () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkCircleColision_exactColision', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(3, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkCirclesColision(circleA, circleB);
    it('shouldExactColide', () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRectanglesColision_noColision', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(3, 1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it('shouldNotColide', () => { expect(movingOutVector).toBe(false, `${movingOutVector} should be false`) })
})

describe('checkRectanglesColision_exactColision', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(3, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it('shouldExactColide', () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})

describe('checkRectanglesColision_colisionX', () => {
    let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(2, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
    it('shouldColideOnX', () => { expect(movingOutVector).toEqual(true, `${movingOutVector} should be true`) })
})


// describe('checkRectanglesColision_colisionY', () => {
//     let rectA = new PhysicalRectangle(new Vector(1, 1), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
//     let rectB = new PhysicalRectangle(new Vector(1, 2), 2, 2, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
//     let movingOutVector = aabbColider.checkRectanglesColision(rectA, rectB);
//     it('shouldColideOnY', () => { expect(movingOutVector).toEqual(new Vector(0, 1), `${movingOutVector} should be null`) })
// })