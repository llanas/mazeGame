import Square from "./square";
import MazeGrid from "./maze-grid";
import Door from "./door";

export default class TreeNode {

    listPaths: Square[][] = [];
    numberMap: Map<number, number[]>;

    constructor(mazeGrid: MazeGrid, squareA: Square, squareB?: Square) {
        this.initNumberMap(mazeGrid);
        let squareADoorsOpen = squareA.getDoorsOpen();
        console.log(`La case n° ${squareA.position} a ${squareADoorsOpen.length} porte(s) ouverte(s)`);
        for (let i = 0; i < squareADoorsOpen.length; i++) {
            this.getPathFromSquare(mazeGrid, squareA, [squareADoorsOpen[i]]);
        }
    }

    initNumberMap(mazeGrid: MazeGrid) {
        this.numberMap = new Map();
        for (let i = 0; i < mazeGrid.listSquares.length; i++) {
            this.numberMap.set(mazeGrid.listSquares[i].position, []);
        }
    }
    
    getPathFromSquare(mazeGrid: MazeGrid, square: Square, _doorsToTreat?: Door[]): Square[] {
        // Initialisation
        let path: Square[] = [];
        this.listPaths.push(path);

        let squareIterator = square;
        let doorsToTreat = _doorsToTreat;
        
        while(true) {
            
            // Setteur
            console.log(`Traitement de la case n°${squareIterator.position}`);
            this.numberMap.get(squareIterator.position).push(this.listPaths.length - 1);
            path.push(squareIterator);
            switch(doorsToTreat.length) {
                case 0: // Cul de sac
                    console.log(`On est dans un cul de sac`);
                    return;
                case 1: // aller
                    console.log(`Une seule porte disponible`);
                    squareIterator = mazeGrid.getSquareByDoor(squareIterator, doorsToTreat[0]);
                    let doorsComeBy = doorsToTreat[0];
                    doorsToTreat = squareIterator.getDoorsOpen();
                    doorsToTreat.splice(doorsToTreat.indexOf(doorsComeBy), 1);
                    break;
                default: // node
                    console.log(`On est dans une intersection où il reste ${doorsToTreat.length} directions possibles`);
                    for (let i = 0; i < doorsToTreat.length; i++) {
                        let nextSquareIterator = mazeGrid.getSquareByDoor(squareIterator, doorsToTreat[i]);
                        let newDoorsToTreat = nextSquareIterator.getDoorsOpen();
                        newDoorsToTreat.splice(newDoorsToTreat.indexOf(doorsToTreat[i]), 1);
                        this.getPathFromSquare(mazeGrid, nextSquareIterator, newDoorsToTreat);
                    }
                    break;
            }
        }
    }
}