import Shape from "../entities/Shape.js";
import ShapeType from "../enums/ShapeType.js";
import { BLOCK_SIZE, context, GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, GAME_BOARD_X, GAME_BOARD_Y } from "../globals.js";
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

        this.shape = ShapeFactory.createInstance(ShapeType.l);
        this.shape.position.x = GAME_BOARD_WIDTH/2;
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
        this.shape.update();
    }

    render(){
        let x = GameBoard.XPOS;
        let y = GameBoard.YPOS;

        // Render the shape (the shape renders each block)
        this.renderShape(this.shape);

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