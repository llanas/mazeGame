const map = []; 

const squareTreatedPool = [];

// Init
(function() {
    const mapWidth = 10;
    const mapHeight = 10;
    initializeMapSquares(mapWidth, mapHeight);
    drawMap();
    document.getElementById("step");
})()

function process() {
    if(squareTreatedPool.lenth == 0) {
        squareTreatedPool.push(map[0][0]);
    }

    
}

function initializeMapSquares(width, height) {

    let squareNumber = 0;
    for(let x = 0; x < width; x++) {
        let colomn = [];
        for(let y = 0; y < height; y++) {
            colomn.push(new Square(squareNumber++, x, y));
        }
        map.push(colomn);
    }
}

function drawMap() {
    
    if(map.length != 0) {
        let domMap = document.getElementById("map");
        for(let x = 0; x < map.length; x++) {
            let domColomns = document.createElement("div");
            domColomns.classList.add("colomn");
            for(let y = 0; y < map[x].length; y++) {
                domColomns.append(map[x][y].generateDom());
            }
            domMap.append(domColomns);
        }
    }
}