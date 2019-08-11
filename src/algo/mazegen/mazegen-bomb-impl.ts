import { IMazeGenerator } from "./mazegen-interface";
import { MazeGrid } from "../../model/maze-grid";
import { Square } from "../../model/square";
import { Utils }  from "../../utils/utils";
import Door from "../../model/door";

interface BombSquare {
    bombNumber: number;
    listSquaresLinked: Square[];
}

export default class BombMazeGenerator implements IMazeGenerator {
    
    isGenerationOver: boolean;
    mazeGrid: MazeGrid;

    mapNumber: Map<number, BombSquare>;
    listDoorsAvailable: Door[];

    constructor(_mazeGrid: MazeGrid) {
        this.mazeGrid = _mazeGrid;
        this.isGenerationOver = false;
        this.mapNumber = new Map();
        for (let i = 0; i < this.mazeGrid.listSquares.length; i++) {
            const squareInProgress = this.mazeGrid.listSquares[i];
            let bombSquare = {bombNumber: squareInProgress.number, listSquaresLinked : [squareInProgress]} as BombSquare;
            this.mapNumber.set(squareInProgress.number, bombSquare);
        }
        this.listDoorsAvailable = this.mazeGrid.listDoors.filter(door => door.isOpenable);
    }

    step(): void {

        let rand = Utils.getRandomInt(this.listDoorsAvailable.length);
        let doorInProgress = this.listDoorsAvailable[rand];
    
        let squareMin = (doorInProgress.isVertical) ? 
            this.mazeGrid.getSquare(doorInProgress.position.gridPosition.x - 1, doorInProgress.position.gridPosition.y) : 
            this.mazeGrid.getSquare(doorInProgress.position.gridPosition.x, doorInProgress.position.gridPosition.y - 1);

        let squareMax = this.mazeGrid.getSquare(doorInProgress.position.gridPosition.x, doorInProgress.position.gridPosition.y);

        let minBomb = this.mapNumber.get(this.mapNumber.get(squareMin.number).bombNumber);
        let maxBomb = this.mapNumber.get(this.mapNumber.get(squareMax.number).bombNumber);

        if(minBomb.bombNumber != maxBomb.bombNumber) {
            if(minBomb.bombNumber > maxBomb.bombNumber) {
                let tempBomb = minBomb;
                minBomb = maxBomb;
                maxBomb = tempBomb;
            }
            for (let i = 0; i < maxBomb.listSquaresLinked.length; i++) {
                const squareItem = maxBomb.listSquaresLinked[i];
                this.mapNumber.get(squareItem.number).bombNumber = minBomb.bombNumber;
                minBomb.listSquaresLinked.push(squareItem);
            }
            maxBomb.bombNumber = minBomb.bombNumber;
            maxBomb.listSquaresLinked = null;
            
            squareMin.isTreated = true;
            squareMax.isTreated = true;
            doorInProgress.open();
        }

        this.listDoorsAvailable.splice(rand, 1);
        
        if(this.mapNumber.get(0).listSquaresLinked.length === this.mazeGrid.listSquares.length) {
            this.mazeGrid.isFullyGenerated = true;
        }
    }
}