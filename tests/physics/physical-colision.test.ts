import '../../src/physics/objects/physical-circle';
import PhysicalCircle from '../../src/physics/objects/physical-circle';
import { CONST_COLIDING_PARAMETERS } from '../../src/physics/utils/physical-parameters';
import Vector from '../../src/physics/objects/physical-vector';
import { Colision } from '../../src/physics/utils/physical-colision';
import PhysicalRectangle from '../../src/physics/objects/physical-rectangle';

describe('checkCircleColision_noColision', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(3, 1), .5, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = Colision.checkCirclesColision(circleA, circleB);
    it('shouldNotColide', () => { expect(movingOutVector).toBe(null, `${movingOutVector} should be null`) })
})

describe('checkCircleColision_exactColision', () => {
    let circleA = new PhysicalCircle(new Vector(1, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let circleB = new PhysicalCircle(new Vector(3, 1), 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = Colision.checkCirclesColision(circleA, circleB);
    it('shouldExactColide', () => { expect(movingOutVector).toEqual(new Vector(2, 0), `${movingOutVector.length} should be 2`) })
})

describe('checkRectanglesColision_noColision', () => {
    let rectA = new PhysicalRectangle(new Vector(1, -1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let rectB = new PhysicalRectangle(new Vector(3, -1), 1, 1, CONST_COLIDING_PARAMETERS.ONLY_COLIDING);
    let movingOutVector = Colision.checkRectanglesColision(rectA, rectB);
    it('shouldNotColide', () => { expect(movingOutVector).toBe(null, `${movingOutVector} should be null`) })
})