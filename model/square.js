"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var door_1 = __importDefault(require("./door"));
var Square = /** @class */ (function () {
    function Square(_number, _mapX, _mapY) {
        this.position = _number;
        this.number = _number;
        this.mapX = _mapX;
        this.mapY = _mapY;
        this.isTreated = false;
        this.topDoor = (_mapY !== 0) ? Square.getSquareByPosition(this.position - 1).bottomDoor : new door_1.default(false, _mapX, _mapY, false);
        this.rightDoor = new door_1.default(_mapX !== mapWidth - 1, _mapX + 1, _mapY, true);
        this.bottomDoor = new door_1.default(_mapY !== mapHeight - 1, _mapX, _mapY + 1, false);
        this.leftDoor = (_mapX !== 0) ? Square.getSquareByPosition(this.position - mapHeight).rightDoor : new door_1.default(false, _mapX, _mapY, true);
        Square.listSquares.push(this);
    }
    Square.getSquareByPosition = function (position) {
        return map[Math.floor(position / mapWidth)][position % mapHeight];
    };
    Square.openDoorBetweenSquares = function (squareMax, squareMin) {
        if (squareMin.position > squareMax.position) {
            var squareTemp = squareMax;
            squareMax = squareMin;
            squareMin = squareTemp;
        }
        switch (squareMax.position - squareMin.position) {
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
    };
    Square.prototype.drawSquare = function (ctx) {
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.mapX * Square.width, this.mapY * Square.height, Square.width, Square.height);
    };
    Square.prototype.getColor = function () {
        return (this.isTreated) ? 'rgb(200, 225, 55)' : 'rgb(220, 90, 90)';
    };
    Square.listSquares = [];
    Square.width = 20;
    Square.height = 20;
    return Square;
}());
exports.default = Square;
