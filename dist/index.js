var index =
(window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([["index"],{

/***/ "./src/algo/mazegen/mazegen-bomb-impl.ts":
/*!***********************************************!*\
  !*** ./src/algo/mazegen/mazegen-bomb-impl.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const utils_1 = __importDefault(__webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts"));

class BombMazeGenerator {
  constructor(_mazeGrid) {
    this.mazeGrid = _mazeGrid;
    this.isGenerationOver = false;
    this.listDoorsAvailable = _mazeGrid.listDoors.filter(door => door.isOpenable);
  }

  step() {
    let rand = utils_1.default.getRandomInt(this.listDoorsAvailable.length);
    let doorInProgress = this.listDoorsAvailable[rand];
    let squareMin = doorInProgress.isVertical ? this.mazeGrid.getSquare(doorInProgress.x - 1, doorInProgress.y) : this.mazeGrid.getSquare(doorInProgress.x, doorInProgress.y - 1);
    let squareMax = this.mazeGrid.getSquare(doorInProgress.x, doorInProgress.y);

    if (squareMin.number < squareMax.number) {
      squareMin.isTreated = true;
      this.mazeGrid.listSquares.filter(square => square.number === squareMax.number).forEach(square => square.number = squareMin.number);
      squareMax.isTreated = true;
      doorInProgress.open();
    } else if (squareMin.number > squareMax.number) {
      squareMin.isTreated = true;
      this.mazeGrid.listSquares.filter(square => square.number === squareMin.number).forEach(square => square.number = squareMax.number);
      squareMax.isTreated = true;
      doorInProgress.open();
    }

    this.listDoorsAvailable.splice(rand, 1);

    if (this.mazeGrid.listSquares.filter(square => square.number != 0).length == 0) {
      this.isGenerationOver = true;
    }
  }

}

exports.default = BombMazeGenerator;

/***/ }),

/***/ "./src/algo/mazegen/mazegen-build-impl.ts":
/*!************************************************!*\
  !*** ./src/algo/mazegen/mazegen-build-impl.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const utils_1 = __importDefault(__webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts"));

class BuildMazeGenerator {
  constructor(_mazeGrid) {
    this.mazeGrid = _mazeGrid;
    this.isGenerationOver = false;
    this.squareTreatedPool = [];
  }

  step() {
    let squareInProgress;

    if (this.squareTreatedPool.length == 0) {
      squareInProgress = this.mazeGrid.getSquareByPosition(utils_1.default.getRandomInt(this.mazeGrid.listSquares.length));
      this.squareTreatedPool.push(squareInProgress);
    } else {
      squareInProgress = this.squareTreatedPool[this.squareTreatedPool.length - 1];
    }

    let neighboursAvailable = [];

    if (squareInProgress.topDoor.isOpenable) {
      let topSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position - 1);
      if (!topSquare.isTreated) neighboursAvailable.push(topSquare);
    }

    if (squareInProgress.rightDoor.isOpenable) {
      let rightSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position + this.mazeGrid.mazeHeight);
      if (!rightSquare.isTreated) neighboursAvailable.push(rightSquare);
    }

    if (squareInProgress.bottomDoor.isOpenable) {
      let bottomSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position + 1);
      if (!bottomSquare.isTreated) neighboursAvailable.push(bottomSquare);
    }

    if (squareInProgress.leftDoor.isOpenable) {
      let leftSquare = this.mazeGrid.getSquareByPosition(squareInProgress.position - this.mazeGrid.mazeWidth);
      if (!leftSquare.isTreated) neighboursAvailable.push(leftSquare);
    }

    if (neighboursAvailable.length !== 0) {
      let nextSquareToTreat = neighboursAvailable[utils_1.default.getRandomInt(neighboursAvailable.length)];
      nextSquareToTreat.isInSolutionPath = true;
      this.mazeGrid.openDoorBetweenSquares(squareInProgress, nextSquareToTreat);
      this.squareTreatedPool.push(nextSquareToTreat);
    } else {
      this.squareTreatedPool[this.squareTreatedPool.length - 1].isInSolutionPath = false;
      this.squareTreatedPool.splice(this.squareTreatedPool.length - 1, 1);
    }

    if (this.squareTreatedPool.length === 0) {
      this.isGenerationOver = true;
    }
  }

}

exports.default = BuildMazeGenerator;

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const maze_grid_1 = __importDefault(__webpack_require__(/*! ./model/maze-grid */ "./src/model/maze-grid.ts"));

const drawer_1 = __importDefault(__webpack_require__(/*! ./utils/drawer */ "./src/utils/drawer.ts"));

const mazegen_build_impl_1 = __importDefault(__webpack_require__(/*! ./algo/mazegen/mazegen-build-impl */ "./src/algo/mazegen/mazegen-build-impl.ts"));

const mazegen_bomb_impl_1 = __importDefault(__webpack_require__(/*! ./algo/mazegen/mazegen-bomb-impl */ "./src/algo/mazegen/mazegen-bomb-impl.ts"));

let maze = null;
let mazeGenAlgo;
let drawer = null;

function init() {
  initMaze();
  drawer = new drawer_1.default("map");
  drawer.drawMaze(maze);
  drawer.display();
}

exports.init = init;

function initMaze() {
  let _mapWidthInput = document.getElementById("mapWidth");

  let _mapHeightInput = document.getElementById("mapHeight");

  maze = new maze_grid_1.default(_mapWidthInput.valueAsNumber, _mapHeightInput.valueAsNumber);
  mazeGenAlgo = _getMazeGenAlgo();
}

exports.initMaze = initMaze;

function process() {
  if (maze != null) {
    if (mazeGenAlgo.isGenerationOver) {
      maze.resetMaze();
      mazeGenAlgo = _getMazeGenAlgo();
    }

    console.time("mazeGen");

    while (!mazeGenAlgo.isGenerationOver) {
      mazeGenAlgo.step();
    }

    console.timeEnd("mazeGen");
    drawer.drawMaze(maze);
  }
}

exports.process = process;

function step() {
  if (maze != null && mazeGenAlgo != null) {
    if (mazeGenAlgo.isGenerationOver) {
      console.log("Maze is fully generated");
    } else {
      mazeGenAlgo.step();
      drawer.drawMaze(maze);
    }
  }
}

exports.step = step;

function solution() {
  console.dir(maze.generateTree());
  console.dir(maze.foundNodeBySquare(maze.listSquares[maze.listSquares.length], maze.treeNode));
}

exports.solution = solution;

function _getMazeGenAlgo() {
  let _algoGenInput = document.querySelector('input[name="algoInput"]:checked');

  switch (_algoGenInput.value) {
    case "build":
      return new mazegen_build_impl_1.default(maze);

    case "bomb":
      return new mazegen_bomb_impl_1.default(maze);
  }
}

/***/ }),

/***/ "./src/model/door.ts":
/*!***************************!*\
  !*** ./src/model/door.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

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
exports.default = Door;

/***/ }),

/***/ "./src/model/maze-grid.ts":
/*!********************************!*\
  !*** ./src/model/maze-grid.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const square_1 = __importDefault(__webpack_require__(/*! ./square */ "./src/model/square.ts"));

const door_1 = __importDefault(__webpack_require__(/*! ./door */ "./src/model/door.ts"));

const utils_1 = __importDefault(__webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts"));

const treeNode_1 = __importDefault(__webpack_require__(/*! ./treeNode */ "./src/model/treeNode.ts"));

class MazeGrid {
  constructor(_mazeWidth, _mazeHeight) {
    this.grid = [];
    this.listSquares = [];
    this.listDoors = [];
    this.treeNode = null;
    this.mazeWidth = _mazeWidth;
    this.mazeHeight = _mazeHeight;
    this.generateGrid();
    this.generateDoors();
  }

  resetMaze() {
    this.listSquares = [];
    this.listDoors = [];
    this.grid = [];
    this.generateGrid();
    this.generateDoors();
  }

  generateGrid() {
    for (let x = 0; x < this.mazeWidth; x++) {
      let colomn = [];
      this.grid.push(colomn);

      for (let y = 0; y < this.mazeHeight; y++) {
        let square = this._buildSquare(x, y);

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

      square.rightDoor = this._buildDoor(square.x + 1, square.y, true, square.x !== this.mazeWidth - 1);
      square.bottomDoor = this._buildDoor(square.x, square.y + 1, false, square.y !== this.mazeHeight - 1);
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

  getSquareByDoor(basedSquare, door) {
    let xPosition;
    let yPosition;

    if (door.isVertical) {
      xPosition = door.x === basedSquare.x ? door.x - 1 : door.x;
      yPosition = door.y;
    } else {
      xPosition = door.x;
      yPosition = door.y === basedSquare.y ? door.y - 1 : door.y;
    }

    return this.getSquare(xPosition, yPosition);
  }

  openDoorBetweenSquares(squareMax, squareMin) {
    if (squareMin.position > squareMax.position) {
      let squareTemp = squareMax;
      squareMax = squareMin;
      squareMin = squareTemp;
    }

    switch (squareMax.position - squareMin.position) {
      case 1:
        squareMin.bottomDoor.open();
        squareMin.isTreated = true;
        squareMax.isTreated = true;
        break;

      case this.mazeWidth:
        squareMin.rightDoor.open();
        squareMin.isTreated = true;
        squareMax.isTreated = true;
        break;
    }
  }

  generateTree() {
    this.treeNode = this.buildNodeTree(null, this.listSquares[0]);
  }

  buildNodeTree(nodeParent, square) {
    let newNode = new treeNode_1.default(nodeParent, square);
    let listDoorsOpen = square.getDoorsOpen();

    for (let i = 0; i < listDoorsOpen.length; i++) {
      if (nodeParent != null && this.getSquareByDoor(square, listDoorsOpen[i]) === nodeParent.square) {
        continue;
      } else {
        let childNode = this.buildNodeTree(newNode, this.getSquareByDoor(square, listDoorsOpen[i]));
        newNode.childrens.push([childNode]);
      }
    }

    return newNode;
  }

  foundNodeBySquare(square, treeNodeIterator) {
    let node = null;

    if (treeNodeIterator.square == square) {
      node = treeNodeIterator;
    } else {
      for (let i = 0; i < treeNodeIterator.childrens.length; i++) {
        for (let y = 0; y < treeNodeIterator.childrens[i].length; y++) {
          node = this.foundNodeBySquare(square, treeNodeIterator.childrens[i][y]);
        }
      }
    }

    return node;
  }

  foundPathBetweenSquares(squareA, squareB) {
    let pathMap = new Map();
    let solutionPath = [];
    let squareInProgress = squareA;
    let nextSquare = null;

    do {
      let listDoorsOpen = squareInProgress.getDoorsOpen();

      if (listDoorsOpen.length === 1) {
        solutionPath.pop();
        nextSquare = solutionPath[solutionPath.length];
      } else {
        let rand = listDoorsOpen.length === 1 ? 0 : utils_1.default.getRandomInt(listDoorsOpen.length);
        nextSquare = this.getSquareByDoor(squareInProgress, listDoorsOpen[rand]);
        squareInProgress = nextSquare;
        solutionPath.push(squareInProgress);
      }
    } while (nextSquare != squareB);

    return solutionPath;
  }

  _buildSquare(_positionX, _positionY) {
    let newSquare = new square_1.default(this.listSquares.length, _positionX, _positionY);
    this.listSquares.push(newSquare);
    return newSquare;
  }

  _buildDoor(_positionX, _positionY, _isVerticale, _isOpenable) {
    let newDoor = new door_1.default(_positionX, _positionY, _isVerticale, _isOpenable);
    this.listDoors.push(newDoor);
    return newDoor;
  }

}

exports.default = MazeGrid;

/***/ }),

/***/ "./src/model/square.ts":
/*!*****************************!*\
  !*** ./src/model/square.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class Square {
  constructor(_number, _mapX, _mapY) {
    this.position = _number;
    this.number = _number;
    this.x = _mapX;
    this.y = _mapY;
    this.isTreated = false;
    Square.listSquares.push(this);
  }

  getDoorsOpen() {
    let listDoorsOpen = [];
    if (this.topDoor.isOpen) listDoorsOpen.push(this.topDoor);
    if (this.rightDoor.isOpen) listDoorsOpen.push(this.rightDoor);
    if (this.bottomDoor.isOpen) listDoorsOpen.push(this.bottomDoor);
    if (this.leftDoor.isOpen) listDoorsOpen.push(this.leftDoor);
    return listDoorsOpen;
  }

  getColor() {
    if (this.isInSolutionPath) {
      return 'rgb(125, 125, 200)';
    } else {
      return this.isTreated ? 'rgb(200, 225, 55)' : 'rgb(220, 90, 90)';
    }
  }

}

Square.listSquares = [];
exports.default = Square;

/***/ }),

/***/ "./src/model/treeNode.ts":
/*!*******************************!*\
  !*** ./src/model/treeNode.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class TreeNode {
  constructor(_parent, _square) {
    this.parent = null;
    this.childrens = [];
    this.parent = _parent;
    this.square = _square;
    this.childrens = [];
  }

}

exports.default = TreeNode;

/***/ }),

/***/ "./src/utils/drawer.ts":
/*!*****************************!*\
  !*** ./src/utils/drawer.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const squareSize = 20;

class Drawer {
  constructor(_canvasId) {
    this.canvas = document.getElementById(_canvasId);

    if (this.canvas.getContext) {
      this.context = this.canvas.getContext("2d");
    } else {
      throw "Le canvas demandé n'existe pas ou n'est pas un élément canvas";
    }
  }

  display() {
    this.canvas.hidden = false;
  }

  drawMaze(_mazeGrid) {
    if (_mazeGrid != null && _mazeGrid.grid.length != 0) {
      this.canvas.width = _mazeGrid.mazeWidth * squareSize;
      this.canvas.height = _mazeGrid.mazeHeight * squareSize;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let x = 0; x < _mazeGrid.mazeWidth; x++) {
        for (let y = 0; y < _mazeGrid.mazeHeight; y++) {
          this.drawSquare(_mazeGrid.grid[x][y]);
        }
      }

      for (let i = 0; i < _mazeGrid.listDoors.length; i++) {
        this.drawDoor(_mazeGrid.listDoors[i]);
      }
    }
  }

  drawSquare(_square) {
    this.context.fillStyle = _square.getColor();
    this.context.fillRect(_square.x * squareSize, _square.y * squareSize, squareSize, squareSize);
  }

  drawDoor(_door) {
    if (!_door.isOpen) {
      this.context.fillStyle = 'rgb(0,0,0)';

      if (_door.isVertical) {
        this.context.fillRect(_door.x * squareSize - 1, _door.y * squareSize, 1, squareSize);
      } else {
        this.context.fillRect(_door.x * squareSize, _door.y * squareSize - 1, squareSize, 1);
      }
    }
  }

}

exports.default = Drawer;

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class Utils {
  static getRandomInt(maxValue) {
    return Math.floor(Math.random() * Math.floor(maxValue));
  }

}

exports.default = Utils;

/***/ })

},[["./src/index.ts","runtime"]]]);
//# sourceMappingURL=index.js.map