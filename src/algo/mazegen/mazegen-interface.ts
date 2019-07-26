import MazeGrid from "../../model/maze-grid";

export default interface IMazeGenerator {

    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    step(): void;
}