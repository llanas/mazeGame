import Player from "../model/player";
import { PhysicalObject } from "../physics/objects/physical-object";
import PhysicalCircle from "../physics/objects/physical-circle";
import PhysicalRectangle from "../physics/objects/physical-rectangle";
import { Coordonate } from "../physics/utils/physical-tools";
import { ObjectRenderer } from "./object-renderer";
import Vector from "../physics/objects/physical-vector";
import { Constants } from "../utils/constants";

export class Drawer {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(_canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(_canvasId);
        if(this.canvas.getContext) {
            this.context = this.canvas.getContext("2d");
            this.resize();
            this.display();
        } else {
            throw "Le canvas demandé n'existe pas ou n'est pas un élément canvas";
        }
    }

    public getCanvasPositionFromWindowCoordonate(coordonate: Coordonate): Vector {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;
          
        return new Vector((coordonate.x - rect.left) * scaleX, (coordonate.y - rect.top) * scaleY);
    }

    display() {
        this.canvas.hidden = false;
    }

    clear() {
        this.context.clearRect(0, 0, Constants.gameCanvasWidth, Constants.gameCanvasHeight);
    }

    resize(width: number = Constants.gameCanvasWidth, height: number = Constants.gameCanvasHeight) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    drawPhysicalObject(obj: PhysicalObject, renderer?: ObjectRenderer) {
        if(obj instanceof PhysicalCircle) {
            this._drawCircle(obj, renderer);
        } else if(obj instanceof PhysicalRectangle) {
            this._drawRectangle(obj, renderer);
        }
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
