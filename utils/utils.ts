export default class Utils {

    static getRandomInt(maxValue: number): number {
        return Math.floor(Math.random() * Math.floor(maxValue));
    }
}