import PhysicalCircle from "../physics/objects/physical-circle";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";

export class Enemy extends PhysicalCircle {

    life: number;

    constructor(position: Position, _life: number = 100) {
        super(position, true, true, Constants.playerSize, ObjectRenderer.enemies);
    }
}