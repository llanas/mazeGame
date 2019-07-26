import MazeGrid from "../model/maze-grid";
import Square from "../model/square";
import Door from "../model/door";

const squareSize = 20;

export default class Drawer {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(_canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(_canvasId);
        if(this.canvas.getContext) {
            this.context = this.canvas.getContext("2d");
        } else {
            throw "Le canvas demandé n'existe pas ou n'est pas un élément canvas";
        }
    }

    display() {
        this.canvas.hidden = false;
    }

    drawMaze(_mazeGrid: MazeGrid): void {
        if(_mazeGrid != null && _mazeGrid.grid.length != 0) {
            this.canvas.width = _mazeGrid.mazeWidth * squareSize;
            this.canvas.height = _mazeGrid.mazeHeight * squareSize;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let x = 0; x < _mazeGrid.mazeWidth; x++) {
                for (let y = 0; y < _mazeGrid.mazeHeight; y++) {
                    this.drawSquare(_mazeGrid.grid[x][y]);
                }
            }
            for (let i = 0; i < _mazeGrid.listDoors.length; i++) {
                this.drawDoor(_mazeGrid.listDoors[i]);
            }
        }
    }

    drawSquare(_square: Square): void {
        this.context.fillStyle = _square.getColor();
        this.context.fillRect(_square.x * squareSize, _square.y * squareSize, squareSize, squareSize);
    }

    drawDoor(_door: Door): void {
        if (!_door.isOpen) {
            this.context.fillStyle = 'rgb(0,0,0)';
            if (_door.isVertical) {
                this.context.fillRect((_door.x * squareSize) - 1, _door.y * squareSize, 1, squareSize);
            }
            else {
                this.context.fillRect(_door.x * squareSize, (_door.y * squareSize) - 1, squareSize, 1);
            }
        }
    }
}
