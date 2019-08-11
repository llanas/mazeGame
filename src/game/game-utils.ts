import { InputController } from "./input-controller";
import Vector from "../physics/objects/physical-vector";
import { Position, Coordonate } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { Game } from "./game";

export class GameUtils {

    public static getPlayerStartPosition(): Position {
        return new Position(Constants.gridSquareSize / 2, Constants.gridSquareSize / 2);
    }
}