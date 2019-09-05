import { Square } from "../model/square";
import { MazeGrid } from "../model/maze-grid";
import Door from "../model/door";
import { Position } from "../physics/utils/physical-tools";

class Node {
    partOf: number[] = [];
    endPath: number = null;
}

export class TreeNode {

    private static mazeGrid: MazeGrid;

    listPaths: Square[][] = [];
    numberMap: Map<number, Node>;

    constructor(squareFrom: Square | Position) {
        let square = (squareFrom instanceof Square) ? squareFrom : TreeNode.mazeGrid.getSquare(squareFrom.x, squareFrom.y);
        if(TreeNode.mazeGrid && TreeNode.mazeGrid.isFullyGenerated) {
            this._initNumberMap();
            let squareADoorsOpen = square.getDoorsOpen();
            for (let i = 0; i < squareADoorsOpen.length; i++) {
                this._getPathFromSquare(square, [squareADoorsOpen[i]]);
            }
        } else {
            throw "Le labyrinthe n'est pas entièrement généré";
        }
    }

    getStraightPathFromSquare(square: Square): Square[] {
        let listStraightPaths: Square[] = [];
        let listIndexPathsInListPath: number[] = [];
        if(this.numberMap.get(square.number).endPath != null) {
            listIndexPathsInListPath.push(this.numberMap.get(square.number).endPath);
        }
        if(this.numberMap.get(square.number).partOf.length != 0) {
            listIndexPathsInListPath.push(... this.numberMap.get(square.number).partOf);
        }
        for (let i = 0; i < listIndexPathsInListPath.length; i++) {
            listStraightPaths.push(... this.listPaths[listIndexPathsInListPath[i]]);
        }
        return listStraightPaths;
    }

    getPathToSquare(square: Square): Square[] {
        let path: Square[] = [square]
        let squareIterator = square;

        while(true) {
            let squareNode: Node = this.numberMap.get(squareIterator.number);
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

            if(squareIterator.number === 0) {
                return path;
            }
        }
    }
    
    private _initNumberMap() {
        this.numberMap = new Map();
        for (let i = 0; i < TreeNode.mazeGrid.listSquares.length; i++) {
            this.numberMap.set(TreeNode.mazeGrid.listSquares[i].number, new Node());
        }
    }

    private _getPathFromSquare(square: Square, _doorsToTreat?: Door[]): Square[] {
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
                    this.numberMap.get(squareIterator.number).endPath = actualPath;
                    return;
                case 1: // aller
                    this.numberMap.get(squareIterator.number).partOf.push(actualPath);
                    squareIterator = TreeNode.mazeGrid.getSquareByDoor(squareIterator, doorsToTreat[0]);
                    let doorsComeBy = doorsToTreat[0];
                    doorsToTreat = squareIterator.getDoorsOpen();
                    doorsToTreat.splice(doorsToTreat.indexOf(doorsComeBy), 1);
                    break;
                default: // node
                    for (let i = 0; i < doorsToTreat.length; i++) {
                        this._getPathFromSquare(squareIterator, [doorsToTreat[i]]);
                    }
                    this.numberMap.get(squareIterator.number).endPath = actualPath;
                    return;
            }
        }
    }
}