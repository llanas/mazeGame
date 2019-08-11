import { InputController } from "./imput-controller";
import Vector from "../physics/objects/physical-vector";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";

export class GameUtils {

    public static getVectorFromInputs() {
        let deltaX = 0;
        let deltaY = 0;
        if(InputController.getInstance().upPressed) deltaY--;
        if(InputController.getInstance().rightPressed) deltaX++; 
        if(InputController.getInstance().downPressed) deltaY++;
        if(InputController.getInstance().leftPressed) deltaX--;
        return new Vector(deltaX, deltaY);
    }

    static getPlayerStartPosition(): Position {
        return new Position(Constants.gridSquareSize / 2, Constants.gridSquareSize / 2);
    }
}