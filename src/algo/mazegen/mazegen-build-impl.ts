import { IMazeGenerator } from "./mazegen-interface";
import { MazeGrid } from "../../model/maze-grid";
import { Square } from "../../model/square";
import { Utils } from "../../utils/utils";
import Door from "../../model/door";

export default class BuildMazeGenerator implements IMazeGenerator {

    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    squareTreatedPool: Square[];

    constructor(_mazeGrid: MazeGrid) {
        this.mazeGrid = _mazeGrid;
        this.isGenerationOver = false;
        this.squareTreatedPool = [];
    }

    step(): void {
        let squareInProgress;
        if(this.squareTreatedPool.length == 0) {
            squareInProgress = this.mazeGrid.getSquareByPosition(Utils.getRandomInt(this.mazeGrid.listSquares.length));
            this.squareTreatedPool.push(squareInProgress);
        } else {
            squareInProgress = this.squareTreatedPool[this.squareTreatedPool.length - 1];
        }

        let neighboursAvailable = [];
        
        let topSquare = this.testDoor(squareInProgress, squareInProgress.topDoor);
        if(topSquare != null && !topSquare.isTreated) neighboursAvailable.push(topSquare);
        
        let rightSquare = this.testDoor(squareInProgress, squareInProgress.rightDoor);
        if(rightSquare != null && !rightSquare.isTreated) neighboursAvailable.push(rightSquare);
        
        let bottomSquare = this.testDoor(squareInProgress, squareInProgress.bottomDoor);
        if(bottomSquare != null && !bottomSquare.isTreated) neighboursAvailable.push(bottomSquare);
        
        let leftSquare = this.testDoor(squareInProgress, squareInProgress.leftDoor);
        if(leftSquare != null && !leftSquare.isTreated) neighboursAvailable.push(leftSquare);
        
        if(neighboursAvailable.length !== 0) {
            let nextSquareToTreat = neighboursAvailable[Utils.getRandomInt(neighboursAvailable.length)];
            nextSquareToTreat.isInSolutionPath = true;
            this.mazeGrid.openDoorBetweenSquares(squareInProgress, nextSquareToTreat);
            this.squareTreatedPool.push(nextSquareToTreat);
        } else {
            this.squareTreatedPool[this.squareTreatedPool.length - 1].isInSolutionPath = false;
            this.squareTreatedPool.splice(this.squareTreatedPool.length - 1, 1);
        }
        if(this.squareTreatedPool.length === 0) {
            this.mazeGrid.isFullyGenerated = true;
        }
    }

    testDoor(square: Square, door: Door) {
        let nextSquare = null;
        if(door.isOpenable && !door.isOpen) {
            nextSquare = this.mazeGrid.getSquareByDoor(square, door);
        }
        return nextSquare;
    }
}