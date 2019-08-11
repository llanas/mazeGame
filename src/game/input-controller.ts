import { Key } from 'ts-keycode-enum';
import { Coordonate } from '../physics/utils/physical-tools';

export class InputController {
    
    private static instance: InputController;

    static getInstance(): InputController {
        if(!InputController.instance) {
            InputController.instance = new InputController();
        } 
        return InputController.instance;
    }

    private constructor() {
        document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
        document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
        document.addEventListener('mousemove', this.updateMousePosition.bind(this), false);
    }

    public upPressed: boolean = false;
    public rightPressed: boolean = false;
    public downPressed: boolean = false;
    public leftPressed: boolean = false;

    public firePressed: boolean = false;
    public mousePosition: Coordonate;

    updateMousePosition(event: MouseEvent) {
        this.mousePosition = {x: event.pageX, y: event.pageY};
    }

    keyDownHandler(event: KeyboardEvent): void {
        if(event.keyCode === Key.Space) {
            this.firePressed = true;
        }
        if(event.keyCode === Key.RightArrow || event.keyCode === Key.D) {
            this.rightPressed = true;
        } else if(event.keyCode === Key.LeftArrow || event.keyCode === Key.Q) {
            this.leftPressed = true;
        }
        if(event.keyCode === Key.DownArrow || event.keyCode === Key.S) {
            this.downPressed = true;
        } else if(event.keyCode === Key.UpArrow || event.keyCode === Key.Z) {
            this.upPressed = true;
        }
    }

    keyUpHandler(event: KeyboardEvent): void {
        if(event.keyCode === Key.Space) {
            this.firePressed = false;
        }
        if(event.keyCode === Key.RightArrow || event.keyCode === Key.D) {
            this.rightPressed = false;
        } else if(event.keyCode === Key.LeftArrow || event.keyCode === Key.Q) {
            this.leftPressed = false;
        }
        if(event.keyCode === Key.DownArrow || event.keyCode === Key.S) {
            this.downPressed = false;
        } else if(event.keyCode === Key.UpArrow || event.keyCode === Key.Z) {
            this.upPressed = false;
        }
    }
}