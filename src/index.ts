import MazeGrid from "./model/maze-grid";

var maze: MazeApp = null;

export function init() {
    maze = new MazeApp();
}

export function initMaze() {
    maze.init();
}

export function process() {
    maze.process();
}

export function step() {
    maze.step();
}

class MazeApp {
    
    maze: MazeGrid = null;

    constructor() {

    }
    
    init() {
        let _mapWidthInput = <HTMLInputElement> document.getElementById("mapWidth");
        let _mapHeightInput = <HTMLInputElement> document.getElementById("mapHeight");
        this.maze = new MazeGrid(_mapWidthInput.valueAsNumber, _mapHeightInput.valueAsNumber);
    }
    
    process() {
        
    }

    step() {
        
    }
}