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
import { TreeNode } from "../algo/treeNode";
import { MazeGrid } from "../model/maze-grid";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";

export class Game {

    private static gameInstance: Game;
    public static getInstance() {
        return Game.gameInstance;
    }

    public static instanciate(groundLayer: GroundLayer) {
        Game.gameInstance = new Game(groundLayer);
    }

    private _everySecondInterval: number;
    private _enemiesPopingInterval: number;

    private _fps: number;
    public get fps() {
        return this._fps;
    }

    private animationFrameId: number;

    public groundLayer: GroundLayer;
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
        this._enemiesPopingInterval = setInterval(() => this.addEnemy(), Constants.enemiesPopingInterval);
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
        let listEnemies = <Enemy[]> this.enemiesLayer.matrix.getAll<Enemy>(CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, Enemy);
        for (let i = 0; i < listEnemies.length; i++) {
            const enemy = listEnemies[i];
            if(enemy.position.gridPosition === this.player.position.gridPosition) {
                enemy.movingVector = this.player.position.vector.clone().subtract(enemy.position.vector).normalize().scale(enemy.speed);
            } else {
                // let pathToPlayer = playerTreeNode.getPathToSquare(this.groundLayer.mazeGrid.getSquare(enemy.position.gridPosition.x, enemy.position.gridPosition.y));
                // enemy.movingVector = MazeGrid.getVectorBetweenSquare(pathToPlayer[pathToPlayer.length - 1], pathToPlayer[pathToPlayer.length - 2]).normalize().scale(enemy.speed);
            }
        }
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
        alert("T'AS MOURU !!");
    }

    isGameOver() {
        return this.player.life <= 0;
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
