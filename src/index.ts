import MazeGrid from "./model/maze-grid";
import Drawer from "./game/drawer";
import IMazeGenerator from "./algo/mazegen/mazegen-interface";
import BuildMazeGenerator from "./algo/mazegen/mazegen-build-impl";
import BombMazeGenerator from "./algo/mazegen/mazegen-bomb-impl";
import TreeNode from "./model/treeNode";
import Vector from "./physics/objects/physical-vector";
import { Game } from "./game/game";
import { Constants } from "./utils/constants";

export let v = Vector;
export let maze: MazeGrid = null;
export let game: Game = null;

let mazeGenAlgo: IMazeGenerator;
let groundLayerDrawer: Drawer = null;

// GAME CONTROLLER
let fpsInterval: number;

export function init() {
    initMaze();

    groundLayerDrawer = new Drawer(Constants.groundLayerId);
    groundLayerDrawer.drawMaze(maze);
    groundLayerDrawer.display();
}


// MAZE INPUT

export function initMaze() {
    let _mapWidthInput = <HTMLInputElement> document.getElementById("mapWidth");
    let _mapHeightInput = <HTMLInputElement> document.getElementById("mapHeight");

    maze = new MazeGrid(_mapWidthInput.valueAsNumber, _mapHeightInput.valueAsNumber);
    mazeGenAlgo = _getMazeGenAlgo();
}

export function process() {
    if(maze != null) {
        if(maze.isFullyGenerated) {
            maze.resetMaze();
            mazeGenAlgo = _getMazeGenAlgo();
        }
        console.time("mazeGen");
        try {
            while(!maze.isFullyGenerated) {
                mazeGenAlgo.step();
            }
        } finally {
            console.timeEnd("mazeGen");
        }
        groundLayerDrawer.drawMaze(maze);
    }
}

export function step() {
    if(maze != null && mazeGenAlgo != null) {
        if(mazeGenAlgo.isGenerationOver) {
            console.log("Maze is fully generated");
        } else {
            mazeGenAlgo.step();
            groundLayerDrawer.drawMaze(maze);
        }
    }
}

export function solution() {
    console.time("mazeSolution");
    let treeNode = new TreeNode(maze, maze.getSquareByPosition(0));
    let solutionPath = treeNode.getPathToSquare(maze.listSquares[maze.listSquares.length - 1]);
    console.timeEnd("mazeSolution");
    for (let i = 0; i < solutionPath.length; i++) {
        solutionPath[i].isInSolutionPath = true;
    }
    groundLayerDrawer.drawMaze(maze);
}

function _getMazeGenAlgo(): IMazeGenerator {
    let _algoGenInput = <HTMLInputElement> document.querySelector('input[name="algoInput"]:checked');
    switch(_algoGenInput.value) {
        case "build": 
            return new BuildMazeGenerator(maze);
        case "bomb": 
            return new BombMazeGenerator(maze);
    }
}


// GAME INPUTS

export function start() {
    if(game != null) {
        stop();
    }
    game = new Game(groundLayerDrawer, maze);
    fpsInterval = setInterval(updateFrameId, 1000);
    game.start();
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
