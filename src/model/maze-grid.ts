import { Square } from "./square";
import Door from "./door";
import { Position, ListPhysicalObject } from "../physics/utils/physical-tools";
import { TreeNode } from "../algo/treeNode";
import { PhysicalMatrix } from "../physics/utils/physical-matrix";
import { PhysicalObject } from "../physics/objects/physical-object";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";
import Vector from "../physics/objects/physical-vector";

export class MazeGrid extends PhysicalMatrix<PhysicalObject> {

    public listSquares: ListPhysicalObject<Square> = new ListPhysicalObject<Square>();
    public listDoors:  ListPhysicalObject<Door> = new ListPhysicalObject<Door>();
    
    width: number;
    height: number;

    private _treeNode: TreeNode;
    private _isFullyGenerated: boolean = false;

    constructor(_mazeWidth: number, _mazeHeight: number) {
        super(_mazeWidth + 1, _mazeHeight + 1);

        this.width = _mazeWidth;
        this.height = _mazeHeight

        this._generateGrid();
        this._generateDoors();
    }

    static getVectorBetweenSquare(squareA: Square, squareB: Square): Vector {
        return squareB.getCenterPosition().vector.clone().subtract(squareA.getCenterPosition().vector);
    }

    getSquare(x: number, y: number): Square {
        return <Square> this.get<Square>(x, y, CONST_COLIDING_PARAMETERS.EMPTY_COLIDING, Square)[0];
    }

    getStraightPathsFromPosition(position: Position): Square[] {
        let square = this.getSquare(position.gridPosition.x, position.gridPosition.y);
        return this._treeNode.getStraightPathFromSquare(square);
    } 

    getSolutionPath(): Square[] {
        if(this.isFullyGenerated) {
            return this._treeNode.getPathToSquare(this.listSquares[this.listSquares.length - 1]);
        }
    }

    getSquareByPosition(position: number): Square {
        return this.listSquares[position];
    }

    getSquareByDoor(basedSquare: Square, door: Door): Square {
        let xPosition;
        let yPosition;
        if(door.isOpenable) {
            if(door.isVertical) {
                xPosition = (door.position.gridPosition.x === basedSquare.position.gridPosition.x) ? door.position.gridPosition.x - 1 : door.position.gridPosition.x;
                yPosition = door.position.gridPosition.y;
            } else {
                xPosition = door.position.gridPosition.x;
                yPosition = (door.position.gridPosition.y === basedSquare.position.gridPosition.y) ? door.position.gridPosition.y - 1 : door.position.gridPosition.y;
            }
            return this.getSquare(xPosition, yPosition);
        } else {
            throw "La porte n'est pas ouvrable";
        }
    }

    openDoorBetweenSquares(squareMax: Square, squareMin: Square): void {
        if(squareMin === squareMax) {
            throw "Impossible d'ouvrir la porte, entre une même case! Revois ton code ;)";
        }
        if(squareMin.number > squareMax.number) {
            let squareTemp = squareMax;
            squareMax = squareMin;
            squareMin = squareTemp;
        }

        switch(squareMax.number - squareMin.number) {
            case 1: 
                squareMin.bottomDoor.open();
                squareMin.isTreated = true;
                squareMax.isTreated = true;
                break;
            case this.height:
                squareMin.rightDoor.open();
                squareMin.isTreated = true;
                squareMax.isTreated = true;
                break;
            default:
                throw `Impossible d'ouvrir la porte, les cases n°${squareMin.position} et n°${squareMax.position} ne sont pas adjacentes`;
        }
    }

    // GETTEURS SETTEURS
    public get isFullyGenerated(): boolean {
        return this._isFullyGenerated;
    }
    public set isFullyGenerated(value: boolean) {
        this._isFullyGenerated = value;
        if(value) {
            this._treeNode = new TreeNode(this.listSquares[0]);
        }
    }

    // METHODES PRIVATE
    private _generateGrid(): void {
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                this._buildSquare(x, y);
            }
        }
    }

    private _generateDoors() {
        for (let i = 0; i < this.listSquares.length; i++) {
            const square = this.listSquares[i];

            if(square.position.y !== 0) {
                square.topDoor = this.getSquareByPosition(square.number - 1).bottomDoor;
            } else {
                square.topDoor = this._buildDoor(square.position.gridPosition.x, square.position.gridPosition.y, false, false);
            }

            if(square.position.x !== 0) {
                square.leftDoor = this.getSquareByPosition(square.number - this.height).rightDoor;
            } else {
                square.leftDoor = this._buildDoor(square.position.gridPosition.x, square.position.gridPosition.y, true, false);
            }

            square.rightDoor = this._buildDoor(square.position.gridPosition.x + 1, square.position.gridPosition.y, true, square.position.gridPosition.x !== this.width - 1);
            square.bottomDoor = this._buildDoor(square.position.gridPosition.x, square.position.gridPosition.y + 1, false, square.position.gridPosition.y !== this.height - 1);
        }
    }

    private _buildSquare(_gridX: number, _gridY: number): Square {
        let squarePosition = Position.buildFromGridPosition(_gridX, _gridY);
        let newSquare = new Square(this.listSquares.length, squarePosition);
        this.listSquares.push(newSquare);
        this.push(newSquare, squarePosition.gridPosition);
        return newSquare;
    }

    private _buildDoor(_gridX: number, _gridY: number, _isVerticale: boolean, _isOpenable: boolean): Door {
        let doorPosition = Position.buildFromGridPosition(_gridX, _gridY);
        let newDoor = new Door(doorPosition, _isVerticale, _isOpenable);
        this.listDoors.push(newDoor);
        this.push(newDoor, doorPosition.gridPosition);
        return newDoor;
    }
}