import { MazeGrid } from "./model/maze-grid";
import { Drawer } from "./renderer/drawer";
import { IMazeGenerator } from "./algo/mazegen/mazegen-interface";
import BuildMazeGenerator from "./algo/mazegen/mazegen-build-impl";
import BombMazeGenerator from "./algo/mazegen/mazegen-bomb-impl";
import Vector from "./physics/objects/physical-vector";
import { Game } from "./game/game";
import { Constants } from "./utils/constants";

export let v = Vector;
export let mazeGrid = MazeGrid;
export let game: Game = null;
export let constant = Constants;

let mazeGenAlgo: IMazeGenerator;
let groundLayerDrawer: Drawer = null;

// GAME CONTROLLER
let fpsInterval: number;

export function init() {
    initMaze();

    groundLayerDrawer = new Drawer(Constants.groundLayerId);
    groundLayerDrawer.drawMaze();
    groundLayerDrawer.display();
}


// MAZE INPUT

export function initMaze() {
    let _mapWidthInput = <HTMLInputElement> document.getElementById("mapWidth");
    let _mapHeightInput = <HTMLInputElement> document.getElementById("mapHeight");

    MazeGrid.builder(_mapWidthInput.valueAsNumber, _mapHeightInput.valueAsNumber);
    mazeGenAlgo = _getMazeGenAlgo();
}

export function process() {
    let mazeInstance = MazeGrid.getInstance();
    if(mazeInstance.isFullyGenerated) {
        // mazeInstance.resetMaze();
        mazeGenAlgo = _getMazeGenAlgo();
    }
    console.time("mazeGen");
    try {
        while(!mazeInstance.isFullyGenerated) {
            mazeGenAlgo.step();
        }
    } finally {
        console.timeEnd("mazeGen");
    }
    groundLayerDrawer.drawMaze();
}

export function step() {
    if(MazeGrid.getInstance() != null && mazeGenAlgo != null) {
        if(mazeGenAlgo.isGenerationOver) {
            console.log("Maze is fully generated");
        } else {
            mazeGenAlgo.step();
            groundLayerDrawer.drawMaze();
        }
    }
}

export function solution() {
    console.time("mazeSolution");
    let solutionPath = MazeGrid.getInstance().getSolutionPath();
    console.timeEnd("mazeSolution");
    for (let i = 0; i < solutionPath.length; i++) {
        solutionPath[i].isInSolutionPath = true;
    }
    groundLayerDrawer.drawMaze();
}

function _getMazeGenAlgo(): IMazeGenerator {
    let _algoGenInput = <HTMLInputElement> document.querySelector('input[name="algoInput"]:checked');
    switch(_algoGenInput.value) {
        case "build": 
            return new BuildMazeGenerator();
        case "bomb": 
            return new BombMazeGenerator();
    }
}


// GAME INPUTS

export function start() {
    if(game != null) {
        stop();
    }
    game = new Game(groundLayerDrawer);
    fpsInterval = setInterval(updateFrameId, 1000);
    game.start();
}

export function addEnemi() {
    if(game != null) {
        game.addEnemy();
    }
}

export function stop() {
    game.end();
    game = null;
    clearInterval(fpsInterval);
}

function updateFrameId() {
    let frameIdInput = <HTMLInputElement> document.getElementById("framePerSecond");
    frameIdInput.value = "" + game.fps;
}

(function() {
    let domGameContent = <HTMLElement> document.getElementById("gameContent");
    Constants.canvasOffsetLeft = domGameContent.offsetLeft;
    Constants.canvasOffsetTop = domGameContent.offsetTop;
})();
