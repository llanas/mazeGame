import MazeGenerator from "./mazegen-interface";
import MazeGrid from "../../model/maze-grid";
import Square from "../../model/square";
import Utils from "../../utils/utils";
import Door from "../../model/door";

export default class BombMazeGenerator implements MazeGenerator {
    
    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    listDoorsAvailable: Door[];

    constructor(_mazeGrid: MazeGrid) {
        this.mazeGrid = _mazeGrid;
        this.isGenerationOver = false;
        this.listDoorsAvailable = Door.listDoors.filter(door => door.isOpenable);
    }

    step(): void {

        let rand = Utils.getRandomInt(this.listDoorsAvailable.length);
        let doorInProgress = this.listDoorsAvailable[rand];
    
        let squareMin = (doorInProgress.isVertical) ? 
            this.mazeGrid.getSquare(doorInProgress.x - 1, doorInProgress.y) : 
            this.mazeGrid.getSquare(doorInProgress.x, doorInProgress.y - 1);

        let squareMax = this.mazeGrid.getSquare(doorInProgress.x, doorInProgress.y);
    
        if(squareMin.number < squareMax.number) {
            squareMin.isTreated = true;
            Square.listSquares.filter(square => square.number === squareMax.number).forEach(square => square.number = squareMin.number);
            squareMax.isTreated = true;
            doorInProgress.open();
        } else if(squareMin.number > squareMax.number) {
            squareMin.isTreated = true;
            Square.listSquares.filter(square => square.number === squareMin.number).forEach(square => square.number = squareMax.number);
            squareMax.isTreated = true;
            doorInProgress.open();
        }
        this.listDoorsAvailable.splice(rand, 1);
        if(this.mazeGrid.listSquares.filter(square => square.number != 0).length != 0) {
            this.isGenerationOver = true;
        }
    }
}