import MazeGrid from "./model/maze-grid";
import Drawer from "./utils/drawer";
import IMazeGenerator from "./algo/mazegen/mazegen-interface";
import BuildMazeGenerator from "./algo/mazegen/mazegen-build-impl";
import BombMazeGenerator from "./algo/mazegen/mazegen-bomb-impl";
import TreeNode from "./model/treeNode";
import GameController from "./controls/game-controller";
import PhysicalEngine from "./physics/physical-engine";
import Player from "./model/player";
import { Direction, Position } from "./physics/utils/physical-tools";
import PhysicalObject from "./physics/objects/physical-object";

export let maze: MazeGrid = null;

let mazeGenAlgo: IMazeGenerator;
let drawer: Drawer = null;

let player: Player = null;

// GAME CONTROLLER
let gameController: GameController = null;
let animationFrameId: number = null;
let lastAnimationFrameId: number = 0;
let fpsInterval: number;

export function init() {
    initMaze();

    drawer = new Drawer("map");
    drawer.drawMaze(maze);
    drawer.display();
}

export function start() {
    fpsInterval = setInterval(updateFrameId, 1000);
    if(animationFrameId == null) {
        gameController = new GameController();
        player = new Player(new Position(10, 10));
        render();
        animationFrameId = window.requestAnimationFrame(update);
    }
}

function update(timeStamp: DOMHighResTimeStamp) {
    let deltaX = 0;
    let deltaY = 0;
    if(gameController.upPressed) deltaY--;
    if(gameController.rightPressed) deltaX++; 
    if(gameController.downPressed) deltaY++;
    if(gameController.leftPressed) deltaX--;

    if(deltaX !== 0 || deltaY !== 0) {
        let playerDirection = Direction.buildDirectionFromPositions(Position.buildFromGridPosition(deltaX, deltaY));
        PhysicalEngine.move(player, playerDirection, player.speed);
    }
    if(player.position.gridPosition.x === maze.mazeWidth - 1 && player.position.gridPosition.y === maze.mazeHeight - 1) {
        stop();
        alert("YOU WIN BATARD !");
        return;
    }
    render();
    // Rendering
    animationFrameId = window.requestAnimationFrame(update);
}

export function stop() {
    window.cancelAnimationFrame(animationFrameId);
    gameController = null;
    player = null;
    animationFrameId = null;
    lastAnimationFrameId = 0;
    clearInterval(fpsInterval);
}

function updateFrameId() {
    let deltaFrame = animationFrameId - lastAnimationFrameId;
    lastAnimationFrameId = animationFrameId;
    let frameIdInput = <HTMLInputElement> document.getElementById("framePerSecond");
    frameIdInput.value = "" + deltaFrame;
}

function render() {
    drawer.clear();
    drawer.drawMaze(maze);
    drawer.drawPlayer(player);
}


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
        drawer.drawMaze(maze);
    }
}

export function step() {
    if(maze != null && mazeGenAlgo != null) {
        if(mazeGenAlgo.isGenerationOver) {
            console.log("Maze is fully generated");
        } else {
            mazeGenAlgo.step();
            drawer.drawMaze(maze);
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
    drawer.drawMaze(maze);
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