var test =
(window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([[2],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MazeGrid; });
/* harmony import */ var _square__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _door__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


class MazeGrid {
  constructor(_mazeWidth, _mazeHeight) {
    this.grid = [];
    this.mazeWidth = _mazeWidth;
    this.mazeHeight = _mazeHeight;
    this.generateGrid();
    this.generateDoors();
  }

  generateGrid() {
    for (let x = 0; x < this.mazeWidth; x++) {
      let colomn = [];
      this.grid.push(colomn);

      for (let y = 0; y < this.mazeHeight; y++) {
        let square = this._buildSquare(x, y);

        this.listSquares.push(square);
        colomn.push(square);
      }
    }
  }

  generateDoors() {
    for (let i = 0; i < this.listSquares.length; i++) {
      const square = this.listSquares[i];

      if (square.y !== 0) {
        square.topDoor = this.getSquareByPosition(square.position - 1).bottomDoor;
      } else {
        square.topDoor = this._buildDoor(square.x, square.y, false, false);
      }

      if (square.x !== 0) {
        square.leftDoor = this.getSquareByPosition(square.position - this.mazeHeight).rightDoor;
      } else {
        square.leftDoor = this._buildDoor(square.x, square.y, true, false);
      }

      square.rightDoor = this._buildDoor(square.x, square.y, true, square.x !== this.mazeWidth - 1);
      square.bottomDoor = this._buildDoor(square.x, square.y, true, square.y !== this.mazeHeight - 1);
    }
  }

  getSquare(_gridX, _gridY) {
    if (_gridX < this.mazeWidth && _gridY < this.mazeHeight) {
      return this.grid[_gridX][_gridY];
    } else {
      throw "La case demandé n'est pas dans le labyrinthe";
    }
  }

  getSquareByPosition(position) {
    return this.grid[Math.floor(position / this.mazeWidth)][position % this.mazeHeight];
  }

  _buildSquare(_positionX, _positionY) {
    let newSquare = new _square__WEBPACK_IMPORTED_MODULE_0__["default"](this.listSquares.length, _positionX, _positionY);
    this.listSquares.push(newSquare);
    return newSquare;
  }

  _buildDoor(_positionX, _positionY, _isVerticale, _isOpenable) {
    let newDoor = new _door__WEBPACK_IMPORTED_MODULE_1__["default"](_positionX, _positionY, _isVerticale, _isOpenable);
    this.listDoors.push(newDoor);
    return newDoor;
  }

}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Square; });
class Square {
  constructor(_number, _mapX, _mapY) {
    this.position = _number;
    this.number = _number;
    this.x = _mapX;
    this.y = _mapY;
    this.isTreated = false;
    Square.listSquares.push(this);
  }

  getColor() {
    return this.isTreated ? 'rgb(200, 225, 55)' : 'rgb(220, 90, 90)';
  }

}
Square.listSquares = [];
Square.width = 20;
Square.height = 20;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Door; });
class Door {
  constructor(_mapX, _mapY, _isVertical, _isOpenable) {
    this.isOpenable = _isOpenable;
    this.isOpen = false;
    this.x = _mapX;
    this.y = _mapY;
    this.isVertical = _isVertical;
    Door.listDoors.push(this);
  }

  open() {
    if (this.isOpenable) {
      this.isOpen = true;
    }
  }

}
Door.listDoors = [];

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "test", function() { return test; });
/* harmony import */ var _model_maze_grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var maze2 = null;
function test() {
  maze2 = new _model_maze_grid__WEBPACK_IMPORTED_MODULE_0__["default"](20, 20);
}

/***/ })
],[[4,0]]]);