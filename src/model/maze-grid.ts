import { Square } from "./square";
import Door from "./door";
import { ListPhysicalObject, Coordonate } from "../physics/utils/physical-tools";
import { TreeNode } from "../algo/treeNode";
import { PhysicalMatrix } from "../physics/utils/physical-matrix";
import { PhysicalObject } from "../physics/objects/physical-object";
import { CONST_COLIDING_PARAMETERS } from "../physics/utils/physical-parameters";
import Vector from "../physics/objects/physical-vector";
import { Constants } from "../utils/constants";

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
        return squareB.getCenterPosition().clone().subtract(squareA.getCenterPosition());
    }

    getSquare({x, y}: {x: number, y: number}): Square {
        return <Square> this.get<Square>(x, y, CONST_COLIDING_PARAMETERS.EMPTY_COLIDING, Square)[0];
    }

    getStraightPathsFromPosition(position: Coordonate): Square[] {
        let square = this.getSquare(position);
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
                xPosition = (door.coordonate.x === basedSquare.coordonate.x) ? door.coordonate.x - 1 : door.coordonate.x;
                yPosition = door.coordonate.y;
            } else {
                xPosition = door.coordonate.x;
                yPosition = (door.coordonate.y === basedSquare.coordonate.y) ? door.coordonate.y - 1 : door.coordonate.y;
            }
            return this.getSquare({x: xPosition, y: yPosition});
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
            this._treeNode = new TreeNode(this.listSquares[0], this);
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

            if(square.coordonate.y !== 0) {
                square.topDoor = this.getSquareByPosition(square.number - 1).bottomDoor;
            } else {
                square.topDoor = this._buildDoor(square.coordonate.x, square.coordonate.y, false, false);
            }

            if(square.coordonate.x !== 0) {
                square.leftDoor = this.getSquareByPosition(square.number - this.height).rightDoor;
            } else {
                square.leftDoor = this._buildDoor(square.coordonate.x, square.coordonate.y, true, false);
            }

            square.rightDoor = this._buildDoor(square.coordonate.x + 1, square.coordonate.y, true, square.coordonate.x !== this.width - 1);
            square.bottomDoor = this._buildDoor(square.coordonate.x, square.coordonate.y + 1, false, square.coordonate.y !== this.height - 1);
        }
    }

    private _buildSquare(_gridX: number, _gridY: number): Square {
        let newSquare = new Square(this.listSquares.length, new Vector(_gridX * Constants.gridSquareSize, _gridY * Constants.gridSquareSize));
        this.listSquares.push(newSquare);
        this.push(newSquare, {x: _gridX, y: _gridY});
        return newSquare;
    }

    private _buildDoor(_gridX: number, _gridY: number, _isVerticale: boolean, _isOpenable: boolean): Door {
        let newDoor = new Door({x: _gridX, y: _gridY}, _isVerticale, _isOpenable);
        this.listDoors.push(newDoor);
        this.push(newDoor, {x: _gridX, y: _gridY});
        return newDoor;
    }
}