import PhysicalObject from "./objects/physical-object";
import * as Utils from './utils/physical-utils';
import { Direction, Position } from "./utils/physical-tools";

export default class PhysicalEngine {

    public static move(object: PhysicalObject, direction: Direction, speed: number): void {
        if(object.movable) {
            let oldPositionX = object.position.x;
            let oldPositionY = object.position.y;

            object.position.x =+ (speed * Math.cos(Utils.toRadian(direction.angle))) + object.position.x;
            object.position.y =+ (speed * Math.sin(Utils.toRadian(direction.angle))) + object.position.y;

            let objectColidingWith = PhysicalEngine.getCollision(object);
            if(objectColidingWith != null) {
                object.position.x = oldPositionX;
                object.position.y = oldPositionY;
            }
        }
    }
    
    static getCollision(object: PhysicalObject): PhysicalObject {

        for (let i = 0; i < PhysicalObject.listColidingObjects.length; i++) {
            const motionLessIterator = PhysicalObject.listColidingObjects[i];
            if(object.checkCollision(motionLessIterator)) {
                return motionLessIterator;
            }
        }
        return null;
    }
}