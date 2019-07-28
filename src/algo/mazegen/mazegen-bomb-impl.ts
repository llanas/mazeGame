import IMazeGenerator from "./mazegen-interface";
import MazeGrid from "../../model/maze-grid";
import Square from "../../model/square";
import Utils from "../../utils/utils";
import Door from "../../model/door";

export default class BombMazeGenerator implements IMazeGenerator {
    
    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    listSquareNumberZero = 1;
    listDoorsAvailable: Door[];

    constructor(_mazeGrid: MazeGrid) {
        this.mazeGrid = _mazeGrid;
        this.isGenerationOver = false;
        this.listDoorsAvailable = _mazeGrid.listDoors.filter(door => door.isOpenable);
    }

    step(): void {

        let rand = Utils.getRandomInt(this.listDoorsAvailable.length);
        let doorInProgress = this.listDoorsAvailable[rand];
    
        let squareMin = (doorInProgress.isVertical) ? 
            this.mazeGrid.getSquare(doorInProgress.x - 1, doorInProgress.y) : 
            this.mazeGrid.getSquare(doorInProgress.x, doorInProgress.y - 1);

        let squareMax = this.mazeGrid.getSquare(doorInProgress.x, doorInProgress.y);

        let minNumber = Math.min(squareMin.number, squareMax.number);
        let maxNumber = Math.max(squareMin.number, squareMax.number);
        
        if(minNumber != maxNumber) {
            for (let i = 0; i < this.mazeGrid.listSquares.length; i++) {
                const square = this.mazeGrid.listSquares[i];
                if(square.number === maxNumber) {
                    square.number = minNumber;
                    if(minNumber === 0) this.listSquareNumberZero++;
                }
            }
            
            squareMin.isTreated = true;
            squareMax.isTreated = true;
            doorInProgress.open();
        }

        this.listDoorsAvailable.splice(rand, 1);
        
        if(this.listSquareNumberZero === this.mazeGrid.listSquares.length) {
            this.mazeGrid.isFullyGenerated = true;
        }
    }
}