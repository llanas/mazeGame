import { Color } from "../utils/utils";
import { Constants } from "../utils/constants";

export class ObjectRenderer {

    static squareBase = new ObjectRenderer(Constants.squareBaseColor);
    static squareTreated = new ObjectRenderer(Constants.squareTreatedColor);
    static squareInSolution = new ObjectRenderer(Constants.squareInSolutionColor);
    static doors = new ObjectRenderer(Constants.doorsColor);
    
    static cloud = new ObjectRenderer(Constants.cloudColor);
    
    static player = new ObjectRenderer(Constants.playerColor);
    static enemies = new ObjectRenderer(Constants.enemiesColor);
    
    static bullet = new ObjectRenderer(Constants.bulletColor);

    private static _defaultRenderer: ObjectRenderer;
    static defaultRenderer(): ObjectRenderer {
        if(ObjectRenderer._defaultRenderer == null) {
            ObjectRenderer._defaultRenderer = new ObjectRenderer(new Color(0, 0, 0, 1));
        }
        return ObjectRenderer._defaultRenderer;
    }

    color: Color;

    constructor(_color: Color) {
        this.color = _color;
    }
}