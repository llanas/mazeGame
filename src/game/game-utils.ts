import Vector from '../physics/utils/physical-vector';
import { Constants } from '../utils/constants';

export class GameUtils {

    public static getPlayerStartPosition(): Vector {
        return new Vector(Constants.gridSquareSize / 2, Constants.gridSquareSize / 2);
    }
}