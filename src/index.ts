import { MazeGrid } from "./model/maze-grid";
import { IMazeGenerator } from "./algo/mazegen/mazegen-interface";
import BuildMazeGenerator from "./algo/mazegen/mazegen-build-impl";
import BombMazeGenerator from "./algo/mazegen/mazegen-bomb-impl";
import Vector from "./physics/objects/physical-vector";
import { Game } from "./game/game";
import { Constants } from "./utils/constants";
import { GroundLayer } from "./physics/layers/ground-layer";

export let v = Vector;
export let mazeGrid = MazeGrid;
export let game = Game;
export let constant = Constants;

let mazeGenAlgo: IMazeGenerator;
let groundLayer: GroundLayer = null;

// GAME CONTROLLER
let fpsInterval: number;

export function init() {

    let gridWidthInput = <HTMLInputElement> document.getElementById("mapWidth");
    let gridHeightInput = <HTMLInputElement> document.getElementById("mapHeight");

    groundLayer = new GroundLayer(gridWidthInput.valueAsNumber, gridHeightInput.valueAsNumber);
    mazeGenAlgo = _getMazeGenAlgo();
    groundLayer.render();

}

export function process() {
    if(groundLayer.mazeGrid.isFullyGenerated) {
        mazeGenAlgo = _getMazeGenAlgo();
    }
    while(!groundLayer.mazeGrid.isFullyGenerated) {
        mazeGenAlgo.step();
    }
    groundLayer.render();
}

export function step() {
    if(groundLayer != null && mazeGenAlgo != null) {
        if(groundLayer.mazeGrid.isFullyGenerated) {
            console.log("Maze is fully generated");
        } else {
            mazeGenAlgo.step();
            groundLayer.render()
        }
    }
}

export function solution() {
    let solutionPath = groundLayer.mazeGrid.getSolutionPath();
    for (let i = 0; i < solutionPath.length; i++) {
        solutionPath[i].isInSolutionPath = true;
    }
    groundLayer.render();
}

function _getMazeGenAlgo(): IMazeGenerator {
    if(groundLayer.mazeGrid != null) {
        let _algoGenInput = <HTMLInputElement> document.querySelector('input[name="algoInput"]:checked');
        switch(_algoGenInput.value) {
            case "build": 
                return new BuildMazeGenerator(groundLayer.mazeGrid);
            case "bomb": 
                return new BombMazeGenerator(groundLayer.mazeGrid);
        }
    }
}


// GAME INPUTS

export function start() {
    if(Game.getInstance() != null) {
        stop();
    }
    Game.instanciate(groundLayer);
    fpsInterval = setInterval(updateFrameId, 1000);
    Game.getInstance().start();
}

export function addEnemi() {
    Game.getInstance().addEnemy();
}

export function stop() {
    Game.getInstance().end();
    clearInterval(fpsInterval);
}

function updateFrameId() {
    let frameIdInput = <HTMLInputElement> document.getElementById("framePerSecond");
    frameIdInput.value = "" + Game.getInstance().fps;
}

(function() {
    let domGameContent = <HTMLElement> document.getElementById("gameContent");
    Constants.canvasOffsetLeft = domGameContent.offsetLeft;
    Constants.canvasOffsetTop = domGameContent.offsetTop;
})();
