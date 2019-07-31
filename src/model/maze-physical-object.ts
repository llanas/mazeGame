import PhysicalObject from "../physics/objects/physical-object";
import { Position } from "../physics/utils/physical-tools";

export default class MazePhysicalObject extends PhysicalObject {

    public static mazeSquareWidth = 20;
    public static mazeSquareHeight = 20;

    mazePosition: Position;

    constructor(_mapX: number, _mapY: number) {
        let realPosition = new Position(_mapX * MazePhysicalObject.mazeSquareWidth, _mapY * MazePhysicalObject.mazeSquareHeight);
        super(realPosition, false, false);
        
        this.mazePosition = new Position(_mapX, _mapY);
    }
}