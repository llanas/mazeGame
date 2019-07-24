import MazeGrid from "./model/maze-grid";

class MazeApp {
    
    maze: MazeGrid = null;
    
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