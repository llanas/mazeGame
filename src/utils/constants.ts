import { Color } from "./utils";

export class Constants {

    // MAZE GRID
    static mazeWidth = 10;
    static mazeHeight = 10;
    static gridSquareSize = 100;

    // CANVAS
    static canvasOffsetTop = 0;
    static canvasOffsetLeft = 0;

    // PLAYER
    static defaultPlayerSpeed = 8;
    static playerSize = Constants.gridSquareSize / 5;
    static playerVisibilityRadius = Constants.gridSquareSize * 5;
    static playerFireDetonationCooldown = 200;

    //WEAPONS
    static bulletSize = Constants.gridSquareSize / 15;
    static bulletSpeed = Constants.gridSquareSize / 5;

    // MOVING
    static sliding_marge = 2;
    
    // COLOR
    static squareBaseColor = new Color(220, 90, 90)
    static squareTreatedColor = new Color(200, 225, 55);
    static squareInSolutionColor = new Color(125, 125, 200);
    static doorsColor = new Color(0, 0, 0, 1);
    
    static cloudOpacity = .9;
    static cloudColor = new Color(125, 125, 150, 1);
    
    static playerColor = new Color(60, 200, 75, 1);
    static enemiesColor = new Color(160, 50, 20, 1);
    
    static bulletColor = new Color(200, 75, 150, 1);
    

    
    // DOM CONTENT READONLY
    static readonly groundLayerId = "ground_layer";
    static readonly playerLayerId = "player_layer";
    static readonly upperLayerId = "upper_layer";
}
