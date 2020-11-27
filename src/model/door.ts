import PhysicalRectangle from '../physics/objects/physical-rectangle';
import { CONST_COLIDING_PARAMETERS } from '../physics/utils/physical-parameters';
import { Coordonate } from '../physics/utils/physical-tools';
import Vector from '../physics/utils/physical-vector';
import { ObjectRenderer } from '../renderer/object-renderer';
import { Constants } from '../utils/constants';

export default class Door extends PhysicalRectangle {

    public static listDoors: Door[] = [];

    isOpenable: boolean;
    isOpen: boolean;

    coordonate: Coordonate;
    isVertical: boolean;

    constructor (_gridCoordinate: Coordonate, _isVertical: boolean, _isOpenable: boolean) {
        let _width = 0;
        let _height = 0;
        let position: Vector;
        if (_isVertical) {
            position = new Vector((_gridCoordinate.x * Constants.gridSquareSize) - Constants.gridSquareSize / 20, (_gridCoordinate.y * Constants.gridSquareSize));
            _width = Constants.gridSquareSize / 10;
            _height = Constants.gridSquareSize + (_width / 2);
        } else {
            position = new Vector((_gridCoordinate.x * Constants.gridSquareSize), (_gridCoordinate.y * Constants.gridSquareSize) - Constants.gridSquareSize / 20);
            _height = Constants.gridSquareSize / 10;
            _width = Constants.gridSquareSize + (_height / 2);
        }

        super(position, _width, _height, CONST_COLIDING_PARAMETERS.ONLY_COLIDING, ObjectRenderer.doors);

        this.coordonate = _gridCoordinate;
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
