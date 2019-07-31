import PhysicalObject from "./objects/physical-object";
import { Direction, Position } from "./utils/physical-tools";
import Door from "../model/door";
import PhysicsUtils from "./utils/physical-utils";

export default class PhysicalEngine {

    public static move(object: PhysicalObject, direction: Direction, speed: number): void {

        if(object.movable) {

            let newX = Number((speed * Math.cos(PhysicsUtils.toRadian(direction.angle))).toFixed(2)) + object.position.x;
            let newY = Number((speed * Math.sin(PhysicsUtils.toRadian(direction.angle))).toFixed(2)) + object.position.y;

            let listColidingObjects = PhysicalObject.getListColidingsObjects(object.position.gridPosition);

            let xColiding = false;
            let yColiding = false;

            for (let i = 0; i < listColidingObjects.length; i++) {
                const objectColidingWith = listColidingObjects[i];

                if(object.checkCollision(objectColidingWith, {x: newX, y: newY})) {
                    if(!object.sliding) return;

                    if(objectColidingWith instanceof Door) {
                        if(objectColidingWith.isVertical) {
                            if(xColiding) return;
                            yColiding = true;
                            newX = object.position.x;
                        } else {
                            if(yColiding) return;
                            xColiding = true;
                            newY = object.position.y;
                        }
                    }
                }
            }
            object.position = new Position(newX, newY);
        }
    }
}