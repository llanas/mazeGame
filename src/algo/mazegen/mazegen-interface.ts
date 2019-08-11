import { MazeGrid } from "../../model/maze-grid";

export interface IMazeGenerator {

    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    step(): void;
}