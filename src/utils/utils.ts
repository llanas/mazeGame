export class Utils {

    static getRandomInt(maxValue: number): number {
        return Math.floor(Math.random() * Math.floor(maxValue));
    }
}

export class Color {

    red: number;
    blue: number;
    green: number;
    opacity: number;

    get rgbValue() {
        return `rgb(${this.red}, ${this.blue}, ${this.green}, ${this.opacity.toFixed(1)})`;
    }

    constructor(red: number, blue: number, green: number, opacity: number = 1) {
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.opacity = opacity;
    }
}