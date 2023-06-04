class Controls{
    constructor(){
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.#addKeyBoardListeners();//the hash makes it private
    }
    #addKeyBoardListeners(){
        document.onkeydown=(e)=>{//add event listener when keys are pressed
            switch(e.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.up = true;
                    break;
                case "ArrowDown":
                    this.down = true;
                    break;
            }
            console.table(this);
        }
        document.onkeyup=(e)=>{//add event listener when keys are release
            switch(e.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.up = false;
                    break;
                case "ArrowDown":
                    this.down = false;
                    break;
            }
            console.table(this);
        }
    }
}