import Shape from "../entities/Shape.js";
import BlockColor from "../enums/BlockColor.js";
import ShapeType from "../enums/ShapeType.js";
import { BLOCK_SIZE, context, GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, GAME_BOARD_X, GAME_BOARD_Y, keys } from "../globals.js";
import BlockFactory from "../services/BlockFactory.js";
import ShapeFactory from "../services/ShapeFactory.js";
import Block from "./Block.js";
import EmptyBlock from "./EmptyBlock.js";

export default class GameBoard {

    static COLUMNS = GAME_BOARD_WIDTH;
    static ROWS = GAME_BOARD_HEIGHT;
    static XPOS = GAME_BOARD_X;
    static YPOS = GAME_BOARD_Y;
    static EMPTY_SPACE = 0;
    static BLOCK_SPACE = 1;

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(width, height, x = GameBoard.XPOS, y = GameBoard.YPOS){
        
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        /**
         * @type {Block[][]}
         */
        this.grid = this.getEmptyBoard();

        this.currentShape = ShapeFactory.createInstance();
        this.nextShape = null;
        
        /**
         * @type {Shape[]}
         */
        this.placedShapes = [];

        this.currentShape.position.x = GAME_BOARD_WIDTH/2 - 1;
        this.currentShape.position.y = 0;
        this.deltaTime = 0;
        this.dropTime = 2;
        this.collisionTime = 0;
        //(x,y) => { list[4*y + x] }
    }

    /**
     * 
     * @returns A 2D array filled with the value 0
     */
    getEmptyBoard(){
        // return Array.from(
        //     {length: this.height}, () => Array(this.width).fill(BlockFactory.createInstance())
        // );

        const grid = [];
		// For each row in the board...
		for (let row = 0; row < this.height; row++) {
			// Insert a new array to represent the row.
			grid.push([]);

			// For each column in the row...
			for (let column = 0; column < this.width; column++) {
				grid[row].push(BlockFactory.createInstance(column, row, false, BlockColor.EmptyWhite));
			}
		}

        return grid;
    }

    update(dt){

        this.deltaTime += dt;
		if(this.deltaTime >= this.dropTime){
			this.deltaTime = 0;
			this.dropCurrentShape();
            if(this.collisionTime >= 2){
                this.placeCurrentShape();
                this.createCurrentShape();
            }
		}

        this.handleMovement();
        this.currentShape.update();


    }

    placeCurrentShape(){
        this.currentShape.onPlace();
        this.collisionTime = 0;
        this.placedShapes.push(this.currentShape);
        
        let startRowMatch = -1;
        let endRowMatch = -1;

        for(let x = 0; x < this.currentShape.dimensions.x; x++){
            for(let y = 0; y < this.currentShape.dimensions.y; y++){
                const block = this.currentShape.blockAt(x,y);
                
                const boardX = this.currentShape.position.x + x;
                const boardY = this.currentShape.position.y + y;
                
                if(block instanceof Block){
                    block.boardX = boardX;
                    block.boardY = boardY;

                    this.grid[boardY][boardX] = block;

                    if(startRowMatch === -1){
                        startRowMatch = boardY;
                    }
                    else{
                        endRowMatch = boardY;
                    }
                }
                
            }
        }

        if(startRowMatch === -1)
            return;

        if(endRowMatch === -1)
            endRowMatch = startRowMatch;

        this.checkRowMatch(startRowMatch, endRowMatch);

    }

    /**
     * 
     * @param {Number} startRow 
     * @param {Number} endRow 
     */
    checkRowMatch(startRow, endRow){
        for(let i = endRow; i >= startRow; i--){
            if(this.grid[i].every(block => !(block instanceof EmptyBlock))){
                for(let j = 0; j < this.grid[i].length; j++){
                    this.grid[i][j] = BlockFactory.createInstance(j, i, false, BlockColor.EmptyWhite);
                }
            }
        }
    }

    /**
     * 
     * @param {Number} boardRow 
     */
    removeRow(boardRow){
        //this.grid[boardRow].fill(GameBoard.EMPTY_SPACE);

    }

    createCurrentShape(){
        this.currentShape = ShapeFactory.createInstance();
        this.currentShape.position.x = GAME_BOARD_WIDTH/2 - 1;
        this.currentShape.position.y = 0;
    }

    dropCurrentShape(){
        const testShape = this.currentShape.clone();
        testShape.drop();

        if(this.validPosition(testShape)){
            this.currentShape = testShape;
        }
        else{
            this.collisionTime++;
        }
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
                    if(shape.blockAt(x, y) instanceof Block && !(this.grid[shape.position.y + y][shape.position.x + x] instanceof EmptyBlock) ){
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
        // Renders current shape
        this.currentShape.render();

        // Renders all grid blocks
        this.renderGridBlocks();
    }

    /**
     * Renders all blocks in the grid (Empty blocks & placed blocks)
     */
    renderGridBlocks(){
        for(let i = 0; i < this.height; i++){
            for(let j = 0; j<this.width; j++){
                this.grid[i][j].render(this.x, this.y);
            }
        }
    }
}