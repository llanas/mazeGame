"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var square_1 = __importDefault(require("./square"));
var Door = /** @class */ (function () {
    function Door(_isOpenable, _mapX, _mapY, _isVertical) {
        this.isOpenable = _isOpenable;
        this.isOpen = false;
        this.mapX = _mapX;
        this.mapY = _mapY;
        this.isVertical = _isVertical;
        Door.listDoors.push(this);
    }
    Door.prototype.open = function () {
        if (this.isOpenable) {
            this.isOpen = true;
        }
    };
    Door.prototype.drawDoor = function (ctx) {
        if (!this.isOpen) {
            ctx.fillStyle = 'rgb(0,0,0)';
            if (this.isVertical) {
                ctx.fillRect((this.mapX * square_1.default.width) - 1, this.mapY * square_1.default.height, 2, square_1.default.height);
            }
            else {
                ctx.fillRect(this.mapX * square_1.default.width, (this.mapY * square_1.default.height) - 1, square_1.default.width, 2);
            }
        }
    };
    Door.listDoors = [];
    return Door;
}());
exports.default = Door;
