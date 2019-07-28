import Square from "./square";
import Door from "./door";

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
    }

    private generateDoors() {
        for (let i = 0; i < this.listSquares.length; i++) {
            const square = this.listSquares[i];

            if(square.y !== 0) {
                square.topDoor = this.getSquareByPosition(square.position - 1).bottomDoor;
            } else {
                square.topDoor = this._buildDoor(square.x, square.y, false, false);
            }

            if(square.x !== 0) {
                square.leftDoor = this.getSquareByPosition(square.position - this.mazeHeight).rightDoor;
            } else {
                square.leftDoor = this._buildDoor(square.x, square.y, true, false);
            }

            square.rightDoor = this._buildDoor(square.x + 1, square.y, true, square.x !== this.mazeWidth - 1);
            square.bottomDoor = this._buildDoor(square.x, square.y + 1, false, square.y !== this.mazeHeight - 1);
        }
    }

    getSquare(_gridX: number, _gridY: number): Square {
        if(_gridX < this.mazeWidth && _gridY < this.mazeHeight) {
            return this.grid[_gridX][_gridY];
        } else {
            throw "La case demandé n'est pas dans le labyrinthe";
        }
    }

    getSquareByPosition(position: number): Square {
        return this.listSquares[position];
        // return this.grid[Math.round(position / (this.mazeWidth / this.mazeHeight))][(position % this.mazeHeight) - 1];
    }

    getSquareByDoor(basedSquare: Square, door: Door): Square {
        let xPosition;
        let yPosition;
        if(door.isOpenable) {
            if(door.isVertical) {
                xPosition = (door.x === basedSquare.x) ? door.x - 1 : door.x;
                yPosition = door.y;
            } else {
                xPosition = door.x;
                yPosition = (door.y === basedSquare.y) ? door.y - 1 : door.y
            }
            return this.getSquare(xPosition, yPosition);
        } else {
            throw "La porte n'est pas ouvrable";
        }
    }

    openDoorBetweenSquares(squareMax: Square, squareMin: Square): void {
        if(squareMin === squareMax) {
            throw "Impossible d'ouvrir la porte, entre une même case! Revois ton code ;)";
        }
        if(squareMin.position > squareMax.position) {
            let squareTemp = squareMax;
            squareMax = squareMin;
            squareMin = squareTemp;
        }

        switch(squareMax.position - squareMin.position) {
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

    private _buildSquare(_positionX: number, _positionY: number): Square {
        let newSquare = new Square(this.listSquares.length, _positionX, _positionY);
        this.listSquares.push(newSquare);
        return newSquare;
    }

    private _buildDoor(_positionX: number, _positionY: number, _isVerticale: boolean, _isOpenable: boolean): Door {
        let newDoor = new Door(_positionX, _positionY, _isVerticale, _isOpenable);
        this.listDoors.push(newDoor);
        return newDoor;
    }
}