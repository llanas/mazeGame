export class ColidingParameters {

    movable: boolean | null = null;
    coliding: boolean | null = null;
    sliding: boolean | null = null;
    bouncing: boolean | null = null;
    destroyOnColision: boolean | null = null;

    constructor(
        { _movable, _coliding, _sliding, _bouncing, _destroyOnColision }:
            { _movable?: boolean, _coliding?: boolean, _sliding?: boolean, _bouncing?: boolean, _destroyOnColision?: boolean }
    ) {
        this.movable = _movable;
        this.coliding = _coliding;
        this.sliding = _sliding;
        this.bouncing = _bouncing;
        this.destroyOnColision = _destroyOnColision;
    }

    equals(parameters: ColidingParameters) {
        if (parameters.movable !== null && parameters.movable !== undefined && parameters.movable !== this.movable) return false;
        if (parameters.coliding !== null && parameters.coliding !== undefined && parameters.coliding !== this.coliding) return false;
        if (parameters.sliding !== null && parameters.sliding !== undefined && parameters.sliding !== this.sliding) return false;
        if (parameters.destroyOnColision !== null && parameters.destroyOnColision !== undefined && parameters.destroyOnColision !== this.destroyOnColision) return false;
        return true;
    }
}

export const CONST_COLIDING_PARAMETERS = {
    EMPTY_COLIDING: new ColidingParameters({}),
    ONLY_COLIDING: new ColidingParameters({ _coliding: true }),
    PERSONNAGE_COLIDING: new ColidingParameters({ _movable: true, _coliding: true, _sliding: true }),
    BULLET_COLIDING: new ColidingParameters({ _movable: true, _coliding: true, _destroyOnColision: true }),
    BULLET_BOUNCING: new ColidingParameters({ _movable: true, _coliding: true, _bouncing: true })
}
