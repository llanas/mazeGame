export default class PhysicalUtils {
    
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