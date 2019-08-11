import { Color } from "./utils";

export class Constants {

    // MAZE GRID
    static gridSquareSize = 100;

    // PLAYER
    static defaultPlayerSpeed = 8;
    static playerSize = 20;
    static playerVisibilityRadius = Constants.gridSquareSize * 2.5;

    // MOVING
    static sliding_marge = 2;
    
    // COLOR
    static fullOpacityColor = new Color(0, 0, 0, 0.1);
    static cloudOpacity = .9;
    static cloudColor = new Color(125, 125, 150, 1);
    
    // DOM CONTENT READONLY
    static readonly groundLayerId = "ground_layer";
    static readonly playerLayerId = "player_layer";
    static readonly upperLayerId = "upper_layer";
}
