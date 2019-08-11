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
    }

    public upPressed: boolean = false;
    public rightPressed: boolean = false;
    public downPressed: boolean = false;
    public leftPressed: boolean = false;


    keyDownHandler(event: KeyboardEvent): any {
        if(event.keyCode === 39) {
            this.rightPressed = true;
        } else if(event.keyCode == 37) {
            this.leftPressed = true;
        }
        if(event.keyCode === 40) {
            this.downPressed = true;
        } else if(event.keyCode === 38) {
            this.upPressed = true;
        }
    }

    keyUpHandler(event: KeyboardEvent): any {
        if(event.keyCode === 39) {
            this.rightPressed = false;
        } else if(event.keyCode == 37) {
            this.leftPressed = false;
        }
        if(event.keyCode === 40) {
            this.downPressed = false;
        } else if(event.keyCode === 38) {
            this.upPressed = false;
        }
    }
}