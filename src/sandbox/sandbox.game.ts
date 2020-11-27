import { boundMethod } from 'autobind-decorator';

import { InputController } from '../game/input-controller';
import Player from '../model/player';
import AABBColision from '../physics/colision/aabb-colision';
import { PhysicalLayer } from '../physics/layers/physical-layer';
import PhysicalCircle from '../physics/objects/physical-circle';
import { PhysicalObject } from '../physics/objects/physical-object';
import PhysicalRectangle from '../physics/objects/physical-rectangle';
import { CONST_COLIDING_PARAMETERS } from '../physics/utils/physical-parameters';
import Vector from '../physics/utils/physical-vector';
import { Drawer } from '../renderer/drawer';
import { ObjectRenderer } from '../renderer/object-renderer';
import { Constants } from '../utils/constants';
import { DomUtils } from '../utils/dom-utils';

export class SandboxGame {

    static GROUND_LAYER_CANVAS_ID = 'sandbox_ground_layer';
    static PLAY_LAYER_CANVAS_ID = 'sandbox_play_layer';

    static OBSTACLES: PhysicalObject[] = [
        new PhysicalRectangle(new Vector(100, 100), 100, 100, CONST_COLIDING_PARAMETERS.ONLY_COLIDING, ObjectRenderer.bullet),
        new PhysicalRectangle(new Vector(500, 500), 20, 100, CONST_COLIDING_PARAMETERS.ONLY_COLIDING, ObjectRenderer.bullet),
        new PhysicalCircle(new Vector(400, 400), 80, CONST_COLIDING_PARAMETERS.ONLY_COLIDING, ObjectRenderer.bullet),
        new PhysicalCircle(new Vector(800, 800), 60, CONST_COLIDING_PARAMETERS.ONLY_COLIDING, ObjectRenderer.bullet)
    ];

    public groundLayer: PhysicalLayer;
    public sandboxLayer: PhysicalLayer;
    public animationFrameId: number;

    public mousePlayer: Player;
    public coliderService = new AABBColision();

    constructor () {
        this.groundLayer = new PhysicalLayer(Constants.mazeWidth, Constants.mazeHeight, new Drawer(SandboxGame.GROUND_LAYER_CANVAS_ID))
        for (let obstacle of SandboxGame.OBSTACLES) {
            this.groundLayer.add(obstacle);
        }
        this.sandboxLayer = new PhysicalLayer(Constants.mazeWidth, Constants.mazeHeight, new Drawer(SandboxGame.PLAY_LAYER_CANVAS_ID))
    }

    start() {
        DomUtils.removeAllFocus();
        let { x, y } = InputController.getInstance().mousePosition;
        this.animationFrameId = window.requestAnimationFrame(this.update);
        this.mousePlayer = new Player(new Vector(x, y));
        this.sandboxLayer.add(this.mousePlayer);
        this.groundLayer.drawer.clear();
        this.groundLayer.render();
    }

    @boundMethod
    update() {
        let mousePosition = this.sandboxLayer.drawer.getCanvasPositionFromWindowCoordonate(InputController.getInstance().mousePosition);
        let separatingVector = mousePosition.clone().subtract(this.mousePlayer.position);
        let oldPosition = this.mousePlayer.position.clone();
        this.mousePlayer.move(separatingVector.unitarize().scale(this.mousePlayer.speed));
        let isColiding = false;
        for (let obstacle of SandboxGame.OBSTACLES) {
            if (this.coliderService.checkColision(this.mousePlayer, obstacle)) {
                isColiding = true;
                break;
            }
        }
        if (isColiding) {
            this.mousePlayer.renderer = ObjectRenderer.enemies
            this.mousePlayer.position = oldPosition;
        } else {
            this.mousePlayer.renderer = ObjectRenderer.player;
        }
        this.sandboxLayer.drawer.clear();
        this.sandboxLayer.render();
        this.animationFrameId = window.requestAnimationFrame(this.update);
    }

    end() {
        this.groundLayer.drawer.clear();
        this.sandboxLayer.drawer.clear();
        window.cancelAnimationFrame(this.animationFrameId);
    }
}