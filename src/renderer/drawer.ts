import { MazeGrid } from "../model/maze-grid";
import Player from "../model/player";
import { Constants } from "../utils/constants";
import { PhysicalObject } from "../physics/objects/physical-object";
import PhysicalCircle from "../physics/objects/physical-circle";
import PhysicalRectangle from "../physics/objects/physical-rectangle";
import { Coordonate, Position } from "../physics/utils/physical-tools";
import { ObjectRenderer } from "./object-renderer";

export class Drawer {

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

    public getCanvasPositionFromWindowCoordonate(coordonate: Coordonate): Position {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;
          
        return new Position((coordonate.x - rect.left) * scaleX, (coordonate.y - rect.top) * scaleY);
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
                    this._drawRectangle(maze.grid[x][y]);
                }
            }
            for (let i = 0; i < maze.listDoors.length; i++) {
                if(!maze.listDoors[i].isOpen)
                this._drawRectangle(maze.listDoors[i]);
            }
        }
    }

    drawPhysicalObject(obj: PhysicalObject) {
        if(obj instanceof PhysicalCircle) {
            this._drawCircle(obj);
        } else if(obj instanceof PhysicalRectangle) {
            this._drawRectangle(obj);
        }
    }

    drawClouds(player: Player) {
        let maze = MazeGrid.getInstance();
        let cloudRenderer = ObjectRenderer.cloud;
        for (let x = 0; x < maze.listSquares.length; x++) {
            let square = maze.listSquares[x]
            /* if(player.listVisibleSquares.indexOf(square) != -1) {
                color.opacity = 0;
            } else  */if(square.hasBeenPassed) {
                cloudRenderer.color.opacity = .9;
            } else {
                cloudRenderer.color.opacity = 1;
            }
            this._drawRectangle(maze.listSquares[x], cloudRenderer);
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

    private _drawCircle(circle: PhysicalCircle, renderer?: ObjectRenderer) {
        this.context.fillStyle = (renderer) ? renderer.color.rgbValue : circle.renderer.color.rgbValue;
        this.context.beginPath();
        this.context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    private _drawRectangle(rectangle: PhysicalRectangle, renderer?: ObjectRenderer) {
        this.context.fillStyle = (renderer) ? renderer.color.rgbValue : rectangle.renderer.color.rgbValue;
        this.context.fillRect(rectangle.position.x, rectangle.position.y, rectangle.width, rectangle.height);
    }
}
