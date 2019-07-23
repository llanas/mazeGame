class Square {

    constructor(_number, _mapX, _mapY) {
        this.number = _number;
        this.mapX = _mapX;
        this.mapY = _mapY;
        this.isTreated = false;

        this.topDoor = new Door();
        this.rightDoor = new Door();
        this.bottomDoor = new Door();
        this.leftDoor = new Door();
    }

    generateDom() {
        let domSquare = document.createElement("div");
        domSquare.classList.add("square");
        let color = this.isTreated ? "yellow" : "red";
        domSquare.classList.add(color);
        if (this === squareTreatedPool[squareTreatedPool.length]) {
            domSquare.classList.add("squareInProgress");
        }
        return domSquare;
    }
}

class Door {

    constructor() {
        this.isOpen = false;
    }
}
