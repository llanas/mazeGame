import { Position } from "../physics/utils/physical-tools";
import PhysicalCircle from "../physics/objects/physical-circle";

const defaultSpeed = 1;

export default class Player extends PhysicalCircle {

    public speed: number;

    constructor(_mapX: number, _mapY: number) {
        let playerPosition = new Position(_mapX, _mapY);
        super(playerPosition, true, true, 5);
        this.speed = defaultSpeed;
    }
}