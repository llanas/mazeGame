import Square from "./square";
import Door from "./door";
import { Position } from "../physics/utils/physical-tools";
import PhysicalCircle from "../physics/objects/physical-circle";
import PhysicalObject from "../physics/objects/physical-object";

export default class MazeGrid {
    
    public mazeWidth: number;
    public mazeHeight: number;
    public grid: Square[][] = [];
    public isFullyGenerated: boolean = false;

    public listSquares: Square[] = [];
    public listDoors: Door[] = [];

    resetMaze() {
        this.listSquares = [];
        this.listDoors = [];
        this.grid = [];
        this.isFullyGenerated = false;
        PhysicalObject.gridObjects = [];
        
        this.generateGrid();
        this.generateDoors();
    }

    constructor(_mazeWidth: number, _mazeHeight: number) {
        this.mazeWidth = _mazeWidth;
        this.mazeHeight = _mazeHeight;

        this.generateGrid();
        this.generateDoors();
    }

    private generateGrid(): void {
        for(let x = 0; x < this.mazeWidth; x++) {
            let colomn: Square[] = [];
            this.grid.push(colomn);
            for(let y = 0; y < this.mazeHeight; y++) {
                let square = this._buildSquare(x, y);
                colomn.push(square);
            }
        }
        PhysicalObject.buildGridObjects(this.mazeWidth, this.mazeHeight);
    }

    private generateDoors() {
        for (let i = 0; i < this.listSquares.length; i++) {
            const square = this.listSquares[i];

            if(square.position.y !== 0) {
                square.topDoor = this.getSquareByPosition(square.number - 1).bottomDoor;
            } else {
                square.topDoor = this._buildDoor(square.position.gridPosition.x, square.position.gridPosition.y, false, false);
            }

            if(square.position.x !== 0) {
                square.leftDoor = this.getSquareByPosition(square.number - this.mazeHeight).rightDoor;
            } else {
                square.leftDoor = this._buildDoor(square.position.gridPosition.x, square.position.gridPosition.y, true, false);
            }

            square.rightDoor = this._buildDoor(square.position.gridPosition.x + 1, square.position.gridPosition.y, true, square.position.gridPosition.x !== this.mazeWidth - 1);
            square.bottomDoor = this._buildDoor(square.position.gridPosition.x, square.position.gridPosition.y + 1, false, square.position.gridPosition.y !== this.mazeHeight - 1);
        }
    }

    getSquareByGridPosition(_gridX: number, _gridY: number): Square {
        if(_gridX < this.mazeWidth && _gridY < this.mazeHeight) {
            return this.grid[_gridX][_gridY];
        } else {
            throw "La case demandé n'est pas dans le labyrinthe";
        }
    }

    getSquareByPosition(position: number): Square {
        return this.listSquares[position];
    }

    getSquareByDoor(basedSquare: Square, door: Door): Square {
        let xPosition;
        let yPosition;
        if(door.isOpenable) {
            if(door.isVertical) {
                xPosition = (door.position.gridPosition.x === basedSquare.position.gridPosition.x) ? door.position.gridPosition.x - 1 : door.position.gridPosition.x;
                yPosition = door.position.gridPosition.y;
            } else {
                xPosition = door.position.gridPosition.x;
                yPosition = (door.position.gridPosition.y === basedSquare.position.gridPosition.y) ? door.position.gridPosition.y - 1 : door.position.gridPosition.y;
            }
            return this.getSquareByGridPosition(xPosition, yPosition);
        } else {
            throw "La porte n'est pas ouvrable";
        }
    }

    openDoorBetweenSquares(squareMax: Square, squareMin: Square): void {
        if(squareMin === squareMax) {
            throw "Impossible d'ouvrir la porte, entre une même case! Revois ton code ;)";
        }
        if(squareMin.number > squareMax.number) {
            let squareTemp = squareMax;
            squareMax = squareMin;
            squareMin = squareTemp;
        }

        switch(squareMax.number - squareMin.number) {
            case 1: 
                squareMin.bottomDoor.open();
                squareMin.isTreated = true;
                squareMax.isTreated = true;
                break;
            case this.mazeHeight:
                squareMin.rightDoor.open();
                squareMin.isTreated = true;
                squareMax.isTreated = true;
                break;
            default:
                throw `Impossible d'ouvrir la porte, les cases n°${squareMin.position} et n°${squareMax.position} ne sont pas adjacentes`;
        }
    }

    private _buildSquare(_gridX: number, _gridY: number): Square {
        let squarePosition = Position.buildFromGridPosition(_gridX, _gridY);
        let newSquare = new Square(this.listSquares.length, squarePosition);
        this.listSquares.push(newSquare);
        return newSquare;
    }

    private _buildDoor(_gridX: number, _gridY: number, _isVerticale: boolean, _isOpenable: boolean): Door {
        let doorPosition = Position.buildFromGridPosition(_gridX, _gridY);
        // if(_isVerticale) {
        //     doorPosition.x--;
        // } else {
        //     doorPosition.y--;
        // }
        let newDoor = new Door(doorPosition, _isVerticale, _isOpenable);
        this.listDoors.push(newDoor);
        return newDoor;
    }
}