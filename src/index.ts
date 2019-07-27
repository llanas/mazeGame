import MazeGrid from "./model/maze-grid";
import Drawer from "./utils/drawer";
import IMazeGenerator from "./algo/mazegen/mazegen-interface";
import BuildMazeGenerator from "./algo/mazegen/mazegen-build-impl";
import BombMazeGenerator from "./algo/mazegen/mazegen-bomb-impl";
import TreeNode from "./model/treeNode";

let maze: MazeGrid = null;
let mazeGenAlgo: IMazeGenerator;
let drawer: Drawer = null;

export function init() {
    initMaze();

    drawer = new Drawer("map");
    drawer.drawMaze(maze);
    drawer.display();
}

export function initMaze() {
    let _mapWidthInput = <HTMLInputElement> document.getElementById("mapWidth");
    let _mapHeightInput = <HTMLInputElement> document.getElementById("mapHeight");
    maze = new MazeGrid(_mapWidthInput.valueAsNumber, _mapHeightInput.valueAsNumber);
    mazeGenAlgo = _getMazeGenAlgo();
}

export function process() {
    if(maze != null) {
        if(mazeGenAlgo.isGenerationOver) {
            maze.resetMaze();
            mazeGenAlgo = _getMazeGenAlgo();
        }
        console.time("mazeGen");
        while(!mazeGenAlgo.isGenerationOver) {
            mazeGenAlgo.step();
        }
        console.timeEnd("mazeGen");
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
    let treeNode = new TreeNode(maze, maze.getSquareByPosition(0), maze.listSquares[maze.listSquares.length - 1]);
    console.dir(treeNode);
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