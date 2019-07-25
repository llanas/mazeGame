import MazeGrid from "../../model/maze-grid";

export default interface MazeGenerator{

    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    step(): void;
}