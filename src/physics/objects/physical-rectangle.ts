import { PhysicalObject } from "./physical-object";
import { Coordonate } from "../utils/physical-tools";
import PhysicalCircle from "./physical-circle";
import PhysicsUtils from "../utils/physical-utils";
import Vector from "./physical-vector";
import { ObjectRenderer } from "../../renderer/object-renderer";
import { ColidingParameters } from "../utils/physical-parameters";
import { Coordonate, Position } from "../utils/physical-tools";
import PhysicsUtils from "../utils/physical-utils";
import PhysicalCircle from "./physical-circle";
import { PhysicalObject } from "./physical-object";
import Vector from "./physical-vector";

export default class PhysicalRectangle extends PhysicalObject {

    width: number;
    height: number;

    constructor(_position: Vector, _width: number, _height: number, _colidingParameters: ColidingParameters, _renderer?: ObjectRenderer) {
        super(_position, _colidingParameters, _renderer);
        this.width = _width;
        this.height = _height;
    }

    
    public get center() : Position {
        return new Position(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    }
    
    public get normals() : Vector[] {
        return [
            new Vector(this.position.x + this.width, this.position.y).subtract(new Vector(this.position.x, this.position.y)).normalL(),
            new Vector(this.position.x, this.position.y + this.height).subtract(new Vector(this.position.x, this.position.y)).normalL()
        ]
    }
    
    checkCollision(object: PhysicalObject, newPosition: Coordonate): boolean {
        let isColliding = false;
        if(object instanceof PhysicalRectangle) {
            isColliding = 
                newPosition.x < object.position.x + object.width 
                && newPosition.x + this.width > object.position.x
                && newPosition.y < object.position.y + object.height 
                && this.height + newPosition.y > object.position.y
        } else if(object instanceof PhysicalCircle) {

            let closestX = PhysicsUtils.findClosestFromCircleCenter(object.position.x, newPosition.x, newPosition.x + this.width);
            let closestY = PhysicsUtils.findClosestFromCircleCenter(object.position.y, newPosition.y, newPosition.y + this.height);

            let deltaX = newPosition.x - closestX;
            let deltaY = newPosition.y - closestY;

            isColliding = Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(object.radius, 2);
        }
        return isColliding;
    }

    getVectorAfterBounce(position: Vector, movingVector: Vector): Vector {
        let minX = Math.min(this.position.x, this.position.x + this.width);
        let maxX = Math.max(this.position.x, this.position.x + this.width);
        let minY = Math.min(this.position.y, this.position.y + this.height);
        let maxY = Math.max(this.position.y, this.position.y + this.height);

        let newX = position.x + movingVector.x;
        let newY = position.y + movingVector.y;

        let side = 0;

        if(minY > newY) side += 1; // Si top
        if(maxX < newX) side += 2; // Si right
        if(maxY < newY) side += 4; // Si bottom
        if(minX > newX) side += 8; // Si left

        switch(side) {
            case 0:
                throw "Incident de collision, le point est à l'intérieur du rectangle";
            case 1: // Only TOP
                movingVector.y = -movingVector.y;
                break;
            case 4: // BOTTOM ONLY
                movingVector.y = -movingVector.y;
                break;
            case 2: // Only RIGHT
                movingVector.x = -movingVector.x;
                break;
            case 8: // ONLY LEFT
                movingVector.x = -movingVector.x;
                break;
            case 3: // TOP-RIGHT
                movingVector.y = -movingVector.y;
                movingVector.x = -movingVector.x;
                break;
            case 6: // RIGHT-BOTTOM
                movingVector.y = -movingVector.y;
                movingVector.x = -movingVector.x;
                break;
            case 12: // BOTTOM-LEFT
                movingVector.y = -movingVector.y;
                movingVector.x = -movingVector.x;
                break;
            case 9: // LEFT-TOP
                movingVector.y = -movingVector.y;
                movingVector.x = -movingVector.x;
                break;
        }
        return movingVector;
    }

    getVectorAfterSlide(position: Vector, radius: number, movingVector: Vector): Vector {

        let minX = Math.min(this.position.x, this.position.x + this.width);
        let maxX = Math.max(this.position.x, this.position.x + this.width);
        let minY = Math.min(this.position.y, this.position.y + this.height);
        let maxY = Math.max(this.position.y, this.position.y + this.height);

        let newX = position.x + movingVector.x;
        let newY = position.y + movingVector.y;

        let side = 0;

        if(minY > newY) side += 1; // Si top
        if(maxX < newX) side += 2; // Si right
        if(maxY < newY) side += 4; // Si bottom
        if(minX > newX) side += 8; // Si left

        let angle = movingVector.angleDeg();

        let deltaY: number;
        let deltaX: number;

        switch(side) {
            case 0:
                throw "Incident de collision, le point est à l'intérieur du rectangle";
            case 1: // Only TOP
                movingVector.y = 0;
                break;
            case 4: // BOTTOM ONLY
                movingVector.y = 0;
                break;
            case 2: // Only RIGHT
                movingVector.x = 0;
                break;
            case 8: // ONLY LEFT
                movingVector.x = 0;
                break;
            case 3: // TOP-RIGHT
                if(angle < 135 && angle >= 90) {
                    // On descend à 90
                    if(maxX + radius >= newX) {
                        movingVector.x = 1;
                        movingVector.y = 0;
                    } else {
                        movingVector.x = 0;
                    }
                } else if(angle > 135) {
                    // On va a gauche 180
                    if(minY - radius <= newY) {
                        movingVector.y = -1;
                        movingVector.x = 0;
                    } else {
                        movingVector.y = 0;
                    }
                } else if(angle === 135) {
                    deltaX = Math.abs(newX - maxX);
                    deltaY = Math.abs(newY - minY);
                    if(deltaX > deltaY) {
                        // On descend à 90
                        if(maxX + radius >= newX) {
                            movingVector.x = 1;
                            movingVector.y = 0;
                        } else {
                            movingVector.x = 0;
                        }
                    } else {
                        // On va a gauche 180
                        if(minY - radius <= newY) {
                            movingVector.y = -1;
                            movingVector.x = 0;
                        } else {
                            movingVector.y = 0;
                        }
                    }
                }
                break;
            case 6: // RIGHT-BOTTOM
                if(angle <= -90 && angle > -135) {
                    // On monte à -90
                    if(maxX + radius >= newX) {
                        // on se décale à droite
                        movingVector.x = 1;
                        movingVector.y = 0;
                    } else {
                        movingVector.x = 0;
                    }
                } else if(angle < -135 || angle === 180) {
                    // On va à gauche 180
                    if(maxY + radius >= newY) {
                        // On se décale vers le bas
                        movingVector.y = 1;
                        movingVector.x = 0;
                    } else {
                        movingVector.y = 0;
                    }
                } else if(angle === -135) {
                    deltaX = Math.abs(newX - maxX);
                    deltaY = Math.abs(newY - maxY);
                    if(deltaX > deltaY) {
                        // On monte à -90
                        if(maxX + radius >= newX) {
                            // on se décale à droite
                            movingVector.x = 1;
                            movingVector.y = 0;
                        } else {
                            movingVector.x = 0;
                        }
                    } else {
                        // On va à gauche 180
                        if(maxY + radius >= newY) {
                            // On se décale vers le bas
                            movingVector.y = 1;
                            movingVector.x = 0;
                        } else {
                            movingVector.y = 0;
                        }
                    }
                }
                break;
            case 12: // BOTTOM-LEFT
                if(angle < -45 && angle >= -90) {
                    // On monte à -90
                    if(minX - radius <= newX) {
                        // On se décale à gauche
                        movingVector.x = -1;
                        movingVector.y = 0;
                    } else {
                        movingVector.x = 0;
                    }
                } else if(angle > -45 && angle <= 0) {
                    // On va à droite 0
                    if(maxY + radius >= newY) {
                        // On se décale vers le bas
                        movingVector.y = 1;
                        movingVector.x = 0
                    } else {
                        movingVector.y = 0;
                    }
                } else if(angle === -45) {
                    deltaX = Math.abs(newX - minX);
                    deltaY = Math.abs(newY - maxY);
                    if(deltaX > deltaY) {
                        // On monte à -90
                        if(minX - radius <= newX) {
                            // On se décale à gauche
                            movingVector.x = -1;
                            movingVector.y = 0;
                        } else {
                            movingVector.x = 0;
                        }
                    } else {
                        // On va à droite 0
                        if(maxY + radius >= newY) {
                            // On se décale vers le bas
                            movingVector.y = 1;
                            movingVector.x = 0
                        } else {
                            movingVector.y = 0;
                        }
                    }
                }
                break;
            case 9: // LEFT-TOP
                if(angle > 45 && angle <= 90) {
                    // On descend 90
                    if(minX - radius <= newX) {
                        // On décale à gauche
                        movingVector.x = -1;
                        movingVector.y = 0;
                    } else {
                        movingVector.x = 0;
                    }
                } else if(angle < 45 && angle >= 0) {
                    // On va à droite 0
                    if(minY - radius <= newY) {
                        // On se décale vers le haut
                        movingVector.y = -1;
                        movingVector.x = 0;
                    } else {
                        movingVector.y = 0;
                    }
                } else if(angle === 45) {
                    deltaX = Math.abs(newX - minX);
                    deltaY = Math.abs(newY - minY);
                    if(deltaX > deltaY) {
                        // On descend 90
                        if(minX - radius <= newX) {
                            // On décale à gauche
                            movingVector.x = -1;
                            movingVector.y = 0;
                        } else {
                            movingVector.x = 0;
                        }
                    } else {
                        // On va à droite 0
                        if(minY - radius <= newY) {
                            // On se décale vers le haut
                            movingVector.y = -1;
                            movingVector.x = 0;
                        } else {
                            movingVector.y = 0;
                        }
                    }
                }
                break;
        }
        return movingVector;
    }
}