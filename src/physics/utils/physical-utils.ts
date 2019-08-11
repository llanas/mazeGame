import { PhysicalObject } from "../objects/physical-object";
import PhysicalCircle from "../objects/physical-circle";

export default class PhysicalUtils {

    static moveListOfObject(listObj: PhysicalObject[]) {
        for (let i = 0; i < listObj.length; i++) {
            const element = listObj[i];
            if(PhysicalObject.listMovableObjects.indexOf(element) != -1) {
                if(element instanceof PhysicalCircle) {
                    element.move();
                }
            } else {
                listObj.splice(i, 1);
            }
        }
    }
    
    static toDegree(radian: number): number {
        return radian * (180 / Math.PI);    
    }
    
    static toRadian(degree: number): number {
        return degree * (Math.PI / 180);
    }
    
    static findClosestFromCircleCenter(circleCenter: number, minX: number, maxX: number) {
        let closest = circleCenter;
        if(closest < minX) closest = minX;
        else if(closest > maxX) closest = maxX;
        return closest;
    }
}