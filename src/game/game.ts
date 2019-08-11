import { InputController } from "./imput-controller";
import Drawer from "./drawer";
import Player from "../model/player";
import { Position } from "../physics/utils/physical-tools";
import { Constants } from "../utils/constants";
import { GameUtils } from "./game-utils";
import MazeGrid from "../model/maze-grid";

export class Game {


    private _everySecondInterval: number;

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

    constructor(groundLayer: Drawer, _maze: MazeGrid) {
        this.maze = _maze;

        this.player = new Player(new Position(10, 10));

        this.groundLayer = groundLayer;
        this.playerLayer = new Drawer(Constants.playerLayerId);
        this.upperLayer = new Drawer(Constants.upperLayerId);
    }
    
    start() {
        this.animationFrameId = window.requestAnimationFrame(this.update.bind(this));
        let lastAnimationFrameId = this.animationFrameId;
        this._everySecondInterval = setInterval(() => {
            this.updateFps(lastAnimationFrameId);
            lastAnimationFrameId = this.animationFrameId;
        }, 1000);
        this.groundLayer.drawMaze(this.maze);
        this.groundLayer.display();
        this.playerLayer.drawPlayer(this.player);
        this.playerLayer.display();
        this.render();

    }

    private update() {
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
    }

    isGameOver() {
        return this.player.position.gridPosition.x === this.maze.mazeWidth - 1 && this.player.position.gridPosition.y === this.maze.mazeHeight - 1;
    }

    private render() {
        this.playerLayer.clear();
        this.playerLayer.drawPlayer(this.player);
    }

    updateFps(lastAnimationFrameId: number) {
        this._fps = this.animationFrameId - lastAnimationFrameId;
    }
}
