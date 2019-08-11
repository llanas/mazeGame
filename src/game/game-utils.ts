import { InputController } from "./imput-controller";
import Vector from "../physics/objects/physical-vector";

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
}