import { Position, Coordonate } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";

export class GameUtils {

    public static getPlayerStartPosition(): Position {
        return new Position(Constants.gridSquareSize / 2, Constants.gridSquareSize / 2);
    }
}