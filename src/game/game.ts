import { Drawer } from "../renderer/drawer";
import Player from "../model/player";
import { Constants } from "../utils/constants";
import { GameUtils } from "./game-utils";
import { MazeGrid } from "../model/maze-grid";
import { InputController } from "./input-controller";
import { PhysicalObject } from "../physics/objects/physical-object";
import PhysicalUtils from "../physics/utils/physical-utils";
import { DomUtils } from "../utils/dom-utils";
import { Enemy } from "../model/enemy";
import { Utils } from "../utils/utils";
import { Position } from "../physics/utils/physical-tools";

export class Game {

    private _everySecondInterval: number;
    private listPhysicalObjects: PhysicalObject[] = [];

    private _fps: number;
    public get fps() {
        return this._fps;
    }

    private animationFrameId: number;

    private groundLayer: Drawer;
    private playerLayer: Drawer;
    private upperLayer: Drawer;

    private player: Player;
    private maze: MazeGrid;

    constructor(groundLayer: Drawer) {
        this.maze = MazeGrid.getInstance();

        this.player = new Player(GameUtils.getPlayerStartPosition());

        this.groundLayer = groundLayer;
        this.playerLayer = new Drawer(Constants.playerLayerId);
        this.upperLayer = new Drawer(Constants.upperLayerId);
    }
    
    start() {
        DomUtils.removeAllFocus();
        this.animationFrameId = window.requestAnimationFrame(this.update.bind(this));
        let lastAnimationFrameId = this.animationFrameId;
        this._everySecondInterval = setInterval(() => {
            this.updateFps(lastAnimationFrameId);
            lastAnimationFrameId = this.animationFrameId;
        }, 1000);
        this.groundLayer.drawMaze();
        this.groundLayer.display();
        this.playerLayer.display();
        this.upperLayer.display();
        this.render();
    }

    private update() {
        PhysicalUtils.moveListOfObject(this.listPhysicalObjects);
        if(InputController.getInstance().firePressed) {
            let firePosition = this.playerLayer.getCanvasPositionFromWindowCoordonate(InputController.getInstance().mousePosition)
            let newBullet = this.player.fire(firePosition);
            if(newBullet != null) this.listPhysicalObjects.push(newBullet);
        }
        let inputVector = GameUtils.getVectorFromInputs();
        this.player.move(inputVector);
    
        if(this.isGameOver()) {
            this.end();
            return;
        }
    
        this.render();
        // Rendering
        this.animationFrameId = window.requestAnimationFrame(this.update.bind(this));
    }

    end() {
        window.cancelAnimationFrame(this.animationFrameId);
        clearInterval(this._everySecondInterval);
        alert("T'es meilleur que Joël!");
    }

    isGameOver() {
        return this.player.position.x - this.player.radius >= (this.maze.mazeWidth - 1) * Constants.gridSquareSize
            && this.player.position.y - this.player.radius >= (this.maze.mazeHeight - 1) * Constants.gridSquareSize;
    }

    addEnemy() {
        let randomXPosition = (Utils.getRandomInt(Constants.mazeWidth) * Constants.gridSquareSize) + (Constants.gridSquareSize / 2);
        let randomYPosition = (Utils.getRandomInt(Constants.mazeWidth) * Constants.gridSquareSize) + (Constants.gridSquareSize / 2);

        let newEnemy = new Enemy(new Position(randomXPosition, randomYPosition));
        this.listPhysicalObjects.push(newEnemy);
    }

    private render() {
        this.playerLayer.clear();
        this.upperLayer.clear();
        for (let i = 0; i < this.listPhysicalObjects.length; i++) {
            this.playerLayer.drawPhysicalObject(this.listPhysicalObjects[i]);
        }
        this.playerLayer.drawPhysicalObject(this.player);
        this.upperLayer.drawClouds(this.player);
    }

    private updateFps(lastAnimationFrameId: number) {
        this._fps = this.animationFrameId - lastAnimationFrameId;
    }
}
