import Shape from "../entities/Shape.js";
import ShapeType from "../enums/ShapeType.js";
import { BLOCK_SIZE, context, GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, GAME_BOARD_X, GAME_BOARD_Y, keys } from "../globals.js";
import ShapeFactory from "../services/ShapeFactory.js";
import Block from "./Block.js";

export default class GameBoard {

    static COLUMNS = GAME_BOARD_WIDTH;
    static ROWS = GAME_BOARD_HEIGHT;
    static XPOS = GAME_BOARD_X;
    static YPOS = GAME_BOARD_Y;

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height){
        
        this.width = width;
        this.height = height;
        
        this.grid = this.getEmptyBoard();

        this.currentShape = ShapeFactory.createInstance();

        this.currentShape.position.x = GAME_BOARD_WIDTH/2;
        //(x,y) => { list[4*y + x] }
    }

    /**
     * 
     * @returns A 2D array filled with the value 0
     */
    getEmptyBoard(){
        return Array.from(
            {length: this.height}, () => Array(this.width).fill(0)
        );
    }

    update(dt){

        this.handleMovement();

        this.currentShape.update();
    }

    handleMovement() {

        const testShape = this.currentShape.clone();
        let didMove = false;
        if(keys.ArrowUp){
			testShape.rotate();
            keys.ArrowUp = false;
            didMove = true;
		}
		else if(keys.ArrowLeft){
            testShape.moveLeft()
            keys.ArrowLeft = false;
            didMove = true;
		}
		else if(keys.ArrowRight){
            testShape.moveRight();
            keys.ArrowRight = false;
            didMove = true;
		}
		else if(keys.ArrowDown){
            testShape.drop();
            keys.ArrowDown = false;
            didMove = true;
		}

        if(didMove && this.validPosition(testShape)){
            this.currentShape = testShape;
        }
        
    }

    /**
     * 
     * @param {Shape} shape 
     */
    validPosition(shape) {
        for(let x = 0; x < shape.dimensions.x; x++){
            for(let y = 0; y < shape.dimensions.y; y++){
                try {
                    if(shape.blockAt(x, y) instanceof Block && this.grid[shape.position.y + y][shape.position.x + x] !== 0){
                        return false;
                    }
                } catch (error) {
                    return false;
                }
                
            }
        }

        return true;
    }

    render(){
        let x = GameBoard.XPOS;
        let y = GameBoard.YPOS;

        // Render the shape (the shape renders each block)
        this.currentShape.render();

        context.save();
        context.strokeStyle = "black";
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j<this.width; j++){
                if(this.grid[i][j] !== 0){
                    // TODO: Render the block
                }

                context.strokeRect(x + j*BLOCK_SIZE, y, BLOCK_SIZE, BLOCK_SIZE);
            }
            
            y+=BLOCK_SIZE;
        }

        context.restore();
    }

    /**
     * 
     * @param {Shape} shape 
     */
    renderShape(shape){
        shape.render();
    }
}