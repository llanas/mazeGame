import { Position, Coordonate } from "../utils/physical-tools";
import Vector from "./physical-vector";
import { ObjectRenderer } from "../../renderer/object-renderer";
import { ColidingParameters } from "../utils/physical-parameters";
import { PhysicalLayer } from "../layers/physical-layer";

export class PhysicalObject {

    position: Position;
    colidingParameters: ColidingParameters;
    movingVector: Vector | null;

    public layer: PhysicalLayer;

    
    public get center() : Position {
        return new Position(this.position.x, this.position.y);
    }
    
    public get normals() : Vector[] {
        return [];
    }

    protected _renderer: ObjectRenderer;
    public get renderer(): ObjectRenderer {
        return this._renderer;
    }
    public set renderer(renderer: ObjectRenderer) {
        this._renderer = renderer;
    }

    constructor(_position: Position, _colidingParameters: ColidingParameters, _renderer: ObjectRenderer = ObjectRenderer.defaultRenderer()) {
        this.position = _position;
        this._renderer = _renderer;
        this.colidingParameters = _colidingParameters;
    }

    colidingWith(colidingObject: PhysicalObject) {

    }

    getPositionAfterMove(vector: Vector = this.movingVector): Position {
        return this.position.clone().move(vector);
    }

    move(movingVector: Vector = this.movingVector) {
        if(this.colidingParameters.movable) {
            if(movingVector != null && !movingVector.isZero()) {
                this.position.move(movingVector);
            }
        }
    }

    checkCollision(object: PhysicalObject, position: Coordonate = this.position): boolean {
        return (position.x === object.position.x || position.y === object.position.y);
    }

    destroy() {
        this.layer.remove(this);
    }
}