import MazeGenerator from "./mazegen-interface";
import MazeGrid from "../../model/maze-grid";
import Square from "../../model/square";
import Utils from "../../utils/utils";

export default class BuildMazeGenerator implements MazeGenerator {

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

        if(squareInProgress.topDoor.isOpenable) {
            let topSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position - 1);
            if(!topSquare.isTreated) neighboursAvailable.push(topSquare);
        }
        
        if(squareInProgress.rightDoor.isOpenable) {
            let rightSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position + this.mazeGrid.mazeHeight);
            if(!rightSquare.isTreated) neighboursAvailable.push(rightSquare);
        }

        if(squareInProgress.bottomDoor.isOpenable) {
            let bottomSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position + 1);
            if(!bottomSquare.isTreated) neighboursAvailable.push(bottomSquare);
        }

        if(squareInProgress.leftDoor.isOpenable) {
            let leftSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position - this.mazeGrid.mazeWidth);
            if(!leftSquare.isTreated) neighboursAvailable.push(leftSquare);
        }

        if(neighboursAvailable.length !== 0) {
            let nextSquareToTreat = neighboursAvailable[Utils.getRandomInt(neighboursAvailable.length)];
            // Square.openDoorBetweenSquares(squareInProgress, nextSquareToTreat);
            this.squareTreatedPool.push(nextSquareToTreat);
        } else {
            this.squareTreatedPool.splice(this.squareTreatedPool.length - 1, 1);
        }
        if(this.squareTreatedPool.length === 0) {
            this.isGenerationOver = true;
        }
    }
}