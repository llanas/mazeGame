import MazeGrid from "../model/maze-grid";
import Square from "../model/square";
import Door from "../model/door";
import Player from "../model/player";
import { Constants } from "../utils/constants";

export default class Drawer {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    public static gameCanvasWidth: number = 100;
    public static gameCanvasHeight: number = 100;

    constructor(_canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(_canvasId);
        if(this.canvas.getContext) {
            this.context = this.canvas.getContext("2d");
            this.resize();
        } else {
            throw "Le canvas demandé n'existe pas ou n'est pas un élément canvas";
        }
    }

    display() {
        this.canvas.hidden = false;
    }

    clear() {
        this.context.clearRect(0, 0, Drawer.gameCanvasWidth, Drawer.gameCanvasHeight);
    }

    resize(width: number = Drawer.gameCanvasWidth, height: number = Drawer.gameCanvasHeight) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    drawMaze(_mazeGrid: MazeGrid): void {
        if(_mazeGrid != null && _mazeGrid.grid.length != 0) {
            Drawer.gameCanvasWidth = (_mazeGrid.mazeWidth * Constants.gridSquareSize);
            Drawer.gameCanvasHeight = (_mazeGrid.mazeHeight * Constants.gridSquareSize);
            this.resize();
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

    drawPlayer(player: Player): void {
        this.context.fillStyle = 'rgb(60, 200, 75)';
        this.context.beginPath();
        this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawSquare(_square: Square): void {
        this.context.fillStyle = _square.getColor();
        this.context.fillRect(_square.position.x, _square.position.y, _square.width, _square.height);
    }

    drawDoor(_door: Door): void {
        if (!_door.isOpen) {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillRect(_door.position.x, _door.position.y, _door.width, _door.height);
        }
    }
}