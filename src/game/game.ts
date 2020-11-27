import { Enemy } from '../model/enemy';
import Player from '../model/player';
import { EnemiesLayer } from '../physics/layers/enemies-layer';
import { GroundLayer } from '../physics/layers/ground-layer';
import { PlayerLayer } from '../physics/layers/player-layer';
import { UpperLayer } from '../physics/layers/upper-layer';
import { CONST_COLIDING_PARAMETERS } from '../physics/utils/physical-parameters';
import Vector from '../physics/utils/physical-vector';
import { Drawer } from '../renderer/drawer';
import { Constants } from '../utils/constants';
import { DomUtils } from '../utils/dom-utils';
import { Utils } from '../utils/utils';
import { GameUtils } from './game-utils';
import { InputController } from './input-controller';

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

    private constructor (groundLayer: GroundLayer) {
        this.player = new Player(GameUtils.getPlayerStartPosition());

        let playableDrawer = new Drawer(Constants.playerLayerId);

        this.groundLayer = groundLayer;
        this.playerLayer = new PlayerLayer(this.player, playableDrawer);
        this.enemiesLayer = new EnemiesLayer(playableDrawer);
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
        if (InputController.getInstance().firePressed) {
            let firePosition = this.playerLayer.drawer.getCanvasPositionFromWindowCoordonate(InputController.getInstance().mousePosition)
            let newBullet = this.player.fire(firePosition);
            if (newBullet != null) this.playerLayer.add(newBullet);
        }

        this.playerLayer.moveAll(this.groundLayer, this.enemiesLayer);
        let listEnemies = <Enemy[]> this.enemiesLayer.matrix.getAll<Enemy>(CONST_COLIDING_PARAMETERS.PERSONNAGE_COLIDING, Enemy);
        // for (let i = 0; i < listEnemies.length; i++) {
        //     const enemy = listEnemies[i];
        //     if(enemy.position.gridPosition === this.player.position.gridPosition) {
        //         enemy.movingVector = this.player.position.clone().subtract(enemy.position).normalize().scale(enemy.speed);
        //     } else {
        //         let pathToPlayer = playerTreeNode.getPathToSquare(this.groundLayer.mazeGrid.getSquare(enemy.position.gridPosition.x, enemy.position.gridPosition.y));
        //         enemy.movingVector = MazeGrid.getVectorBetweenSquare(pathToPlayer[pathToPlayer.length - 1], pathToPlayer[pathToPlayer.length - 2]).normalize().scale(enemy.speed);
        //     }
        // }
        this.enemiesLayer.moveAll(this.groundLayer, this.playerLayer);

        this.render();

        if (this.isGameOver()) {
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

        let newEnemy = new Enemy(new Vector(randomXPosition, randomYPosition));
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
