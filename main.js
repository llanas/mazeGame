// VARIABLES GLOBALES

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

// BUILD ALGO 

function algoBuildProcess() {
    do {
        algoBuildStep();
    } while(squareTreatedPool.length !== 0);
}

function algoBuildStep() {
    
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
