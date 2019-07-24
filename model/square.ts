import Door from "./door";

export default class Square {

    static listSquares: Square[] = [];
    
    static width: number = 20;
    static height: number = 20;

    static openDoorBetweenSquares(squareMax: Square, squareMin: Square): void {
        if(squareMin.position > squareMax.position) {
            let squareTemp = squareMax;
            squareMax = squareMin;
            squareMin = squareTemp;
        }

        switch(squareMax.position - squareMin.position) {
            case 1: 
                squareMin.bottomDoor.open();
                squareMin.isTreated = true;
                squareMax.isTreated = true;
                break;
            case mapWidth:
                squareMin.rightDoor.open();
                squareMin.isTreated = true;
                squareMax.isTreated = true;
                break;
        }
    }

    position: number;
    number: number;
    x: number;
    y: number;
    isTreated: boolean;

    topDoor: Door;
    rightDoor: Door;
    bottomDoor: Door;
    leftDoor: Door;

    constructor(_number: number, _mapX: number, _mapY: number) {
        this.position = _number;
        this.number = _number;
        this.x = _mapX;
        this.y = _mapY;
        this.isTreated = false;
        
        Square.listSquares.push(this);
    }

    getColor(): string {
        return (this.isTreated) ? 'rgb(200, 225, 55)' : 'rgb(220, 90, 90)';
    }
}
