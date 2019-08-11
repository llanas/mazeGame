import { MazeGrid } from "../model/maze-grid";
import Square from "../model/square";
import Door from "../model/door";
import Player from "../model/player";
import { Constants } from "../utils/constants";
import { Color, Utils } from "../utils/utils";

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

    drawMaze(): void {
        let maze = MazeGrid.getInstance();
        if(maze != null && maze.grid.length != 0) {
            Drawer.gameCanvasWidth = (maze.mazeWidth * Constants.gridSquareSize) + Constants.gridSquareSize / 20;
            Drawer.gameCanvasHeight = (maze.mazeHeight * Constants.gridSquareSize) + Constants.gridSquareSize / 20;
            this.resize();
            for (let x = 0; x < maze.mazeWidth; x++) {
                for (let y = 0; y < maze.mazeHeight; y++) {
                    this.drawSquare(maze.grid[x][y]);
                }
            }
            for (let i = 0; i < maze.listDoors.length; i++) {
                this.drawDoor(maze.listDoors[i]);
            }
        }
    }

    drawPlayer(player: Player): void {
        this.context.fillStyle = 'rgb(60, 200, 75)';
        this.context.beginPath();
        this.context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawClouds(player: Player) {
        let maze = MazeGrid.getInstance();
        let color = Constants.cloudColor;
        for (let x = 0; x < maze.listSquares.length; x++) {
            let square = maze.listSquares[x]
            /* if(player.listVisibleSquares.indexOf(square) != -1) {
                color.opacity = 0;
            } else  */if(square.hasBeenPassed) {
                color.opacity = .9;
            } else {
                color.opacity = 1;
            }
            this.drawSquare(maze.listSquares[x], color);
        }
        this.drawPlayerVisionCircle(player);
    }

    drawPlayerVisionCircle(player: Player) {
        this.context.save();
        this.context.globalCompositeOperation = 'destination-out';
        this.context.beginPath();
        this.context.arc(player.position.x, player.position.y, player.visibilityRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    drawSquare(_square: Square, color?: Color): void {
        this.context.fillStyle = (color) ? color.rgbValue : _square.getColor().rgbValue;
        this.context.fillRect(_square.position.x, _square.position.y, _square.width, _square.height);
    }

    drawDoor(_door: Door): void {
        if (!_door.isOpen) {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillRect(_door.position.x, _door.position.y, _door.width, _door.height);
        }
    }
}
