export function toDegree(radian: number): number {
    return radian * (180 / Math.PI);    
}

export function toRadian(degree: number): number {
    return degree * (Math.PI / 180);
}