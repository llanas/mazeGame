import IMazeGenerator from "./mazegen-interface";
import MazeGrid from "../../model/maze-grid";
import Square from "../../model/square";
import Utils from "../../utils/utils";
import Door from "../../model/door";

export default class BombMazeGenerator implements IMazeGenerator {
    
    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    mapNumber: Map<number, Square[]>;
    listDoorsAvailable: Door[];

    constructor(_mazeGrid: MazeGrid) {
        this.mazeGrid = _mazeGrid;
        this.isGenerationOver = false;
        this.mapNumber = new Map();
        for (let i = 0; i < this.mazeGrid.listSquares.length; i++) {
            const squareInProgress = this.mazeGrid.listSquares[i];
            this.mapNumber.set(squareInProgress.number, [squareInProgress]);
        }
        this.listDoorsAvailable = _mazeGrid.listDoors.filter(door => door.isOpenable);
    }

    step(): void {

        let rand = Utils.getRandomInt(this.listDoorsAvailable.length);
        let doorInProgress = this.listDoorsAvailable[rand];
    
        let squareMin = (doorInProgress.isVertical) ? 
            this.mazeGrid.getSquare(doorInProgress.position.x - 1, doorInProgress.position.y) : 
            this.mazeGrid.getSquare(doorInProgress.position.x, doorInProgress.position.y - 1);

        let squareMax = this.mazeGrid.getSquare(doorInProgress.position.x, doorInProgress.position.y);

        let minNumber = Math.min(squareMin.number, squareMax.number);
        let maxNumber = Math.max(squareMin.number, squareMax.number);
        
        if(minNumber != maxNumber) {
            this.mapNumber.get(minNumber).push(... this.mapNumber.get(maxNumber));
            this.mapNumber.delete(maxNumber);
            
            squareMin.isTreated = true;
            squareMax.isTreated = true;
            doorInProgress.open();
        }

        this.listDoorsAvailable.splice(rand, 1);
        
        if(this.mapNumber.size === 1) {
            this.mazeGrid.isFullyGenerated = true;
        }
    }
}