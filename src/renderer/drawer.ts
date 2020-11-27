import Player from '../model/player';
import PhysicalCircle from '../physics/objects/physical-circle';
import { PhysicalObject } from '../physics/objects/physical-object';
import PhysicalRectangle from '../physics/objects/physical-rectangle';
import { Coordonate } from '../physics/utils/physical-tools';
import Vector from '../physics/utils/physical-vector';
import { Constants } from '../utils/constants';
import { ObjectRenderer } from './object-renderer';

/**
 * Drawer
 * 
 * The drawer is link to an IHM canvas by the id passed as parameter
 * It can draw multiple child types of PhyicalObject in the canvas
 */
export class Drawer {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    /**
     * @param _canvasId HTML id of the canvas to draw in
     */
    constructor (_canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(_canvasId);
        if (this.canvas.getContext) {
            this.context = this.canvas.getContext("2d");
            this.resize();
            this.display();
        } else {
            throw "Le canvas demandé n'existe pas ou n'est pas un élément canvas";
        }
    }

    /**
     * Function that returns a Vector position of the coordonate passed as parameter relative to the canvas
     * 
     * @param coordonate Coordonate inside the web window
     */
    public getCanvasPositionFromWindowCoordonate(coordonate: Coordonate): Vector {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        let scaleY = this.canvas.height / rect.height;

        return new Vector((coordonate.x - rect.left) * scaleX, (coordonate.y - rect.top) * scaleY);
    }

    /**
     * Function that hide / display the canvas
     */
    display() {
        this.canvas.hidden = false;
    }

    /**
     * Function that clear the whole canvas
     */
    clear() {
        this.context.clearRect(0, 0, Constants.gameCanvasWidth, Constants.gameCanvasHeight);
    }

    /**
     * Function that resize the canvas based on parameters
     * @param width New canvas width
     * @param height New canvas height
     */
    resize(width: number = Constants.gameCanvasWidth, height: number = Constants.gameCanvasHeight) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Function that draw PhysicalObject into the canvas
     * 
     * @param obj PhysicalObject to draw
     * @param renderer ObjectRenderer of the object
     */
    drawPhysicalObject(obj: PhysicalObject, renderer?: ObjectRenderer) {
        if (obj instanceof PhysicalCircle) {
            this._drawCircle(obj, renderer);
        } else if (obj instanceof PhysicalRectangle) {
            this._drawRectangle(obj, renderer);
        }
    }

    /**
     * Function that draw the player vision
     * It trace a sphere aroud the Player position based on his visibilityRadius
     * 
     * @param player Player
     */
    drawPlayerVisionCircle(player: Player) {
        this.context.save();
        this.context.globalCompositeOperation = 'destination-out';
        this.context.beginPath();
        this.context.arc(player.position.x, player.position.y, player.visibilityRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.restore();
    }

    /**
     * Function that draw circle based on the PhysicalCircle passed as parameter
     * 
     * @param circle PhysicalCircle representing the circle
     * @param renderer ObjectRenderer of the circle
     */
    private _drawCircle(circle: PhysicalCircle, renderer?: ObjectRenderer) {
        this.context.fillStyle = (renderer) ? renderer.color.rgbValue : circle.renderer.color.rgbValue;
        this.context.beginPath();
        this.context.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    /**
     * Function that draw rectangle based on the PhysicalRectangle passed as parameter
     * 
     * @param rectangle PhysicalRectangle representing the rectangle
     * @param renderer ObjectRenderer of the rectangle
     */
    private _drawRectangle(rectangle: PhysicalRectangle, renderer?: ObjectRenderer) {
        this.context.fillStyle = (renderer) ? renderer.color.rgbValue : rectangle.renderer.color.rgbValue;
        this.context.fillRect(rectangle.position.x, rectangle.position.y, rectangle.width, rectangle.height);
    }
}
