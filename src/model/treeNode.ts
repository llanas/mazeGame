import Square from "./square";
import MazeGrid from "./maze-grid";
import Door from "./door";

class Node {
    partOf: number[] = [];
    endPath: number = null;
}

export default class TreeNode {

    listPaths: Square[][] = [];
    numberMap: Map<number, Node>;

    constructor(mazeGrid: MazeGrid, squareA: Square) {
        if(mazeGrid.isFullyGenerated) {
            this.initNumberMap(mazeGrid);
            let squareADoorsOpen = squareA.getDoorsOpen();
            for (let i = 0; i < squareADoorsOpen.length; i++) {
                this.getPathFromSquare(mazeGrid, squareA, [squareADoorsOpen[i]]);
            }
        } else {
            throw "Le labyrinthe n'est pas entièrement généré";
        }
    }

    initNumberMap(mazeGrid: MazeGrid) {
        this.numberMap = new Map();
        for (let i = 0; i < mazeGrid.listSquares.length; i++) {
            this.numberMap.set(mazeGrid.listSquares[i].position, new Node());
        }
    }

    getPathToSquare(square: Square): Square[] {
        let path: Square[] = [square]
        let squareIterator = square;

        while(true) {
            let squareNode: Node = this.numberMap.get(squareIterator.position);
            let pathIterator: Square[] = [];
            if(squareNode.endPath != null) {
                pathIterator = this.listPaths[squareNode.endPath];
                pathIterator.pop();
            } else if(squareNode.partOf.length === 1) {
                pathIterator = this.listPaths[squareNode.partOf[0]];
                if(squareIterator !== square) {
                    pathIterator.splice(pathIterator.indexOf(squareIterator) - 1);
                } else {
                    pathIterator.splice(pathIterator.indexOf(squareIterator));   
                }
            }
            pathIterator.push(...path);
            path = pathIterator;
            squareIterator = path[0];

            if(squareIterator.position === 0) {
                return path;
            }
        }
    }
    
    getPathFromSquare(mazeGrid: MazeGrid, square: Square, _doorsToTreat?: Door[]): Square[] {
        // Initialisation
        let path: Square[] = [];
        this.listPaths.push(path);
        
        let squareIterator = square;
        let doorsToTreat = _doorsToTreat;
        let actualPath = this.listPaths.length - 1;
        
        while(true) {
            
            // Setteur
            path.push(squareIterator);
            switch(doorsToTreat.length) {
                case 0: // Cul de sac
                    this.numberMap.get(squareIterator.position).endPath = actualPath;
                    return;
                case 1: // aller
                    this.numberMap.get(squareIterator.position).partOf.push(actualPath);
                    squareIterator = mazeGrid.getSquareByDoor(squareIterator, doorsToTreat[0]);
                    let doorsComeBy = doorsToTreat[0];
                    doorsToTreat = squareIterator.getDoorsOpen();
                    doorsToTreat.splice(doorsToTreat.indexOf(doorsComeBy), 1);
                    break;
                default: // node
                    for (let i = 0; i < doorsToTreat.length; i++) {
                        this.getPathFromSquare(mazeGrid, squareIterator, [doorsToTreat[i]]);
                    }
                    this.numberMap.get(squareIterator.position).endPath = actualPath;
                    return;
            }
        }
    }
}