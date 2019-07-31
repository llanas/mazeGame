import { Position } from "../physics/utils/physical-tools";
import PhysicalCircle from "../physics/objects/physical-circle";

const defaultSpeed = 3;

export default class Player extends PhysicalCircle {

    public speed: number;

    constructor(position: Position) {
        super(position, true, true, true, 5);
        this.speed = defaultSpeed;
    }
}