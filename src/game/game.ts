import { Drawer } from "../renderer/drawer";
import Player from "../model/player";
import { Constants } from "../utils/constants";
import { GameUtils } from "./game-utils";
import { InputController } from "./input-controller";
import { DomUtils } from "../utils/dom-utils";
import { Enemy } from "../model/enemy";
import { Utils } from "../utils/utils";
import { Position } from "../physics/utils/physical-tools";
import { PlayerLayer } from "../physics/layers/player-layer";
import { GroundLayer } from "../physics/layers/ground-layer";
import { EnemiesLayer } from "../physics/layers/enemies-layer";
import { UpperLayer } from "../physics/layers/upper-layer";

export class Game {

    private static gameInstance: Game;
    public static getInstance() {
        return Game.gameInstance;
    }

    public static instanciate(groundLayer: GroundLayer) {
        Game.gameInstance = new Game(groundLayer);
    }

    private _everySecondInterval: number;

    private _fps: number;
    public get fps() {
        return this._fps;
    }

    private animationFrameId: number;

    private groundLayer: GroundLayer;
    private playerLayer: PlayerLayer;
    private enemiesLayer: EnemiesLayer;
    private upperLayer: UpperLayer;

    private player: Player;

    private constructor(groundLayer: GroundLayer) {
        this.player = new Player(GameUtils.getPlayerStartPosition());

        let playableLayer = new Drawer(Constants.playerLayerId);

        this.groundLayer = groundLayer;
        this.playerLayer = new PlayerLayer(this.player, playableLayer);
        this.enemiesLayer = new EnemiesLayer(playableLayer);
        this.upperLayer = new UpperLayer(this.player, groundLayer.mazeGrid);
    }
    
    start() {
        DomUtils.removeAllFocus();
        this.animationFrameId = window.requestAnimationFrame(this.update.bind(this));
        let lastAnimationFrameId = this.animationFrameId;
        this._everySecondInterval = setInterval(() => {
            this.updateFps(lastAnimationFrameId);
            lastAnimationFrameId = this.animationFrameId;
        }, 1000);
        this.render();
    }

    private update() {
        this.player.movingVector = InputController.getInstance().getVectorFromInputs();
        if(InputController.getInstance().firePressed) {
            let firePosition = this.playerLayer.drawer.getCanvasPositionFromWindowCoordonate(InputController.getInstance().mousePosition)
            let newBullet = this.player.fire(firePosition);
            if(newBullet != null) this.playerLayer.add(newBullet);
        }
        
        this.playerLayer.moveAll(this.groundLayer, this.enemiesLayer);
        this.enemiesLayer.moveAll(this.groundLayer, this.playerLayer);
        
        this.render();

        if(this.isGameOver()) {
            this.end();
            return;
        }

        this.animationFrameId = window.requestAnimationFrame(this.update.bind(this));
    }

    end() {
        window.cancelAnimationFrame(this.animationFrameId);
        clearInterval(this._everySecondInterval);
        Game.gameInstance = null;
        alert("T'es meilleur que Joël!");
    }

    isGameOver() {
        return this.player.position.x - this.player.radius >= (this.groundLayer.mazeGrid.width - 1) * Constants.gridSquareSize
            && this.player.position.y - this.player.radius >= (this.groundLayer.mazeGrid.height - 1) * Constants.gridSquareSize;
    }

    addEnemy() {
        let randomXPosition = (Utils.getRandomInt(Constants.mazeWidth) * Constants.gridSquareSize) + (Constants.gridSquareSize / 2);
        let randomYPosition = (Utils.getRandomInt(Constants.mazeWidth) * Constants.gridSquareSize) + (Constants.gridSquareSize / 2);

        let newEnemy = new Enemy(new Position(randomXPosition, randomYPosition));
        this.enemiesLayer.add(newEnemy);
    }

    private render() {
        this.playerLayer.drawer.clear();
        this.playerLayer.render();
        this.enemiesLayer.render();
        this.upperLayer.render();
    }

    private updateFps(lastAnimationFrameId: number) {
        this._fps = this.animationFrameId - lastAnimationFrameId;
    }
}
