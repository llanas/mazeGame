import Square from "./square";
import Door from "./door";

export default class MazeGrid {
    
    mazeWidth: number;
    mazeHeight: number;
    grid: Square[][] = [];

    listSquares: Square[];
    listDoors: Door[];

    constructor(_mazeWidth: number, _mazeHeight: number) {
        this.mazeWidth = _mazeWidth;
        this.mazeHeight = _mazeHeight;

        this.generateGrid();
        this.generateDoors();
    }

    generateGrid(): void {
        for(let x = 0; x < this.mazeWidth; x++) {
            let colomn: Square[] = [];
            this.grid.push(colomn);
            for(let y = 0; y < this.mazeHeight; y++) {
                let square = this._buildSquare(x, y);
                this.listSquares.push(square);
                colomn.push(square);
            }
        }
    }

    generateDoors() {
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

            square.rightDoor = this._buildDoor(square.x, square.y, true, square.x !== this.mazeWidth - 1);
            square.bottomDoor = this._buildDoor(square.x, square.y, true, square.y !== this.mazeHeight - 1);
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
        return this.grid[Math.floor(position / this.mazeWidth)][position % this.mazeHeight];
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