import { Position } from "../physics/utils/physical-tools";
import PhysicalRectangle from "../physics/objects/physical-rectangle";
import { Constants } from "../utils/constants";
import { ObjectRenderer } from "../renderer/object-renderer";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";

export default class Door extends PhysicalRectangle {

    public static listDoors: Door[] = [];
    
    isOpenable: boolean;
    isOpen: boolean;

    isVertical: boolean;

    constructor(_position: Position, _isVertical: boolean, _isOpenable: boolean) {
        let _width = 0;
        let _height = 0;
        if(_isVertical) {
            _position.x--;
            _width = Constants.gridSquareSize / 10;
            _height = Constants.gridSquareSize + (_width / 2);
        } else {
            _position.y--;
            _height = Constants.gridSquareSize / 10;
            _width = Constants.gridSquareSize + (_height / 2);
        }

        super(_position, _width, _height, CONST_COLIDING_PARAMETERS.ONLY_COLIDING, ObjectRenderer.doors);

        this.isOpenable = _isOpenable;
        this.isOpen = false;
        this.isVertical = _isVertical;
        Door.listDoors.push(this);
    }

    open(): void {
        if (this.isOpenable) {
            this.isOpen = true;
            this.colidingParameters = CONST_COLIDING_PARAMETERS.EMPTY_COLIDING;
        }
    }
}
