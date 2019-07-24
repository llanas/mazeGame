// VARIABLES GLOBALES

let map = [];

let mapWidth;
let mapHeight;

let stepFunction = algoBuildStep;
let processFunction = algoBuildProcess;

// Build Algo
let squareTreatedPool = [];

// Bomb Algo
let listDoorsAvailable = [];

function reinit() {
    map = [];
    squareTreatedPool = [];
    Square.listSquares = [];
    Door.listDoors = [];
}

function initializeMapSquares() {

    reinit();
    mapWidth = document.getElementById("mapWidth").valueAsNumber;
    mapHeight = document.getElementById("mapHeight").valueAsNumber;
    
    let squareNumber = 0;
    for(let x = 0; x < mapWidth; x++) {
        let colomn = [];
        map.push(colomn);
        for(let y = 0; y < mapHeight; y++) {
            colomn.push(new Square(squareNumber++, x, y));
        }
    }
    listDoorsAvailable = Door.listDoors.filter(door => door.isOpenable);
    drawMap();
}

function setBuildAlgo() {
    stepFunction = algoBuildStep;
    processFunction = algoBuildProcess;
}

function setBombAlgo() {
    stepFunction = algoBombStep;
    processFunction = algoBombProcess;
}

function processAll() {
    if(map.length != 0) {
        reinit();
        initializeMapSquares();
    }
    processFunction();
    drawMap();
}

function process() {
    stepFunction();
    drawMap();
}

// BOMB ALGO

function algoBombProcess() {
    while(Square.listSquares.filter(square => square.number != 0).length != 0) {
        algoBombStep();
    }
}

function algoBombStep() {
    let rand = getRandomInt(listDoorsAvailable.length);
    let doorInProgress = listDoorsAvailable[rand];

    let squareMin = (doorInProgress.isVertical) ? map[doorInProgress.mapX - 1][doorInProgress.mapY] : map[doorInProgress.mapX][doorInProgress.mapY - 1];
    let squareMax = map[doorInProgress.mapX][doorInProgress.mapY];

    if(squareMin.number < squareMax.number) {
        squareMin.isTreated = true;
        Square.listSquares.filter(square => square.number === squareMax.number).forEach(square => square.number = squareMin.number);
        squareMax.isTreated = true;
        doorInProgress.open();
    } else if(squareMin.number > squareMax.number) {
        squareMin.isTreated = true;
        Square.listSquares.filter(square => square.number === squareMin.number).forEach(square => square.number = squareMax.number);
        squareMax.isTreated = true;
        doorInProgress.open();
    }
    listDoorsAvailable.splice(rand, 1);
}

// BUILD ALGO 

function algoBuildProcess() {
    do {
        algoBuildStep();
    } while(squareTreatedPool.length !== 0);
}

function algoBuildStep() {
    let squareInProgress;
    if(squareTreatedPool.length == 0) {
        squareInProgress = Square.getSquareByPosition(getRandomInt((mapWidth * mapHeight) - 1));
        squareTreatedPool.push(squareInProgress);
    } else {
        squareInProgress = squareTreatedPool[squareTreatedPool.length - 1];
    }

    let neighboursAvailable = [];

    if(squareInProgress.topDoor.isOpenable) {
        let topSquare = Square.getSquareByPosition(squareInProgress.position - 1);
        if(!topSquare.isTreated) neighboursAvailable.push(topSquare);
    }
    
    if(squareInProgress.rightDoor.isOpenable) {
        let rightSquare = Square.getSquareByPosition(squareInProgress.position + mapWidth);
        if(!rightSquare.isTreated) neighboursAvailable.push(rightSquare);
    }

    if(squareInProgress.bottomDoor.isOpenable) {
        let bottomSquare = Square.getSquareByPosition(squareInProgress.position + 1);
        if(!bottomSquare.isTreated) neighboursAvailable.push(bottomSquare);
    }

    if(squareInProgress.leftDoor.isOpenable) {
        let leftSquare = Square.getSquareByPosition(squareInProgress.position - mapWidth)
        if(!leftSquare.isTreated) neighboursAvailable.push(leftSquare);
    }

    if(neighboursAvailable.length !== 0) {
        let nextSquareToTreat = neighboursAvailable[getRandomInt(neighboursAvailable.length)];
        Square.openDoorBetweenSquares(squareInProgress, nextSquareToTreat);
        squareTreatedPool.push(nextSquareToTreat);
    } else {
        squareTreatedPool.splice(squareTreatedPool.length - 1, 1);
    }
}


// DRAW FUNCTION
function drawMap() {
    
    if(map.length != 0) {
        let canvas = document.getElementById("map");
        canvas.width = mapWidth * Square.width;
        canvas.height = mapHeight * Square.height;

        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(let x = 0; x < map.length; x++) {
                for(let y = 0; y < map[x].length; y++) {
                    map[x][y].drawSquare(ctx);
                }
            }
            for (let i = 0; i < Door.listDoors.length; i++) {
                Door.listDoors[i].drawDoor(ctx);
            }
        }
        if(canvas.hidden) canvas.hidden = false;
    }
}

function getRandomInt(maxValue) {
    return Math.floor(Math.random() * Math.floor(maxValue));
}
