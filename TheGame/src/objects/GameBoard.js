import Shape from "../entities/Shape.js";
import BlockColor from "../enums/BlockColor.js";
import ShapeType from "../enums/ShapeType.js";
import { BLOCK_SIZE, CANVAS_WIDTH, context, GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, GAME_BOARD_X, GAME_BOARD_Y, keys, timer } from "../globals.js";
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

        
        this.createCurrentShape();

        this.updateGhostShape();

        /**
         * @type {Shape}
         */
        this.nextShape = ShapeFactory.createInstance();
        
        /**
         * @type {Shape[]}
         */
        this.placedShapes = [];

        this.deltaTime = 0;
        this.dropTime = 2;
        this.collisionDelay = this.dropTime;
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
        timer.update(dt);

        this.deltaTime += dt;
		if(this.deltaTime >= this.dropTime){
			this.deltaTime = 0;
			this.dropCurrentShape();
            if(this.collisionTime >= this.collisionDelay){
                this.onPlace();
            }
		}

        this.handleMovement();
        this.currentShape.update();
        this.updateGhostShape();
        this.currentGhostShape.update()

    }

    onPlace(){
        this.placeCurrentShape();
        this.startNextFall();
    }

    startNextFall() {
        this.currentShape = this.nextShape;
        this.currentShape.position.x = GAME_BOARD_WIDTH/2 -1;
        this.nextShape = ShapeFactory.createInstance();
    }

    placeCurrentShape(){
        this.currentShape.onPlace();
        this.collisionTime = 0;
        this.placedShapes.push(this.currentShape);

        for(let x = 0; x < this.currentShape.dimensions.x; x++){
            for(let y = 0; y < this.currentShape.dimensions.y; y++){
                const block = this.currentShape.blockAt(x,y);
                
                const boardX = this.currentShape.position.x + x;
                const boardY = this.currentShape.position.y + y;
                
                if(block instanceof Block){
                    block.boardX = boardX;
                    block.boardY = boardY;
                    block.update();
                    this.grid[boardY][boardX] = block;
                }
                
            }
        }

        this.checkRowMatch();

    }

    /**
     * 
     */
    checkRowMatch(){
        for(let row = this.height-1; row >= 0; row--){
            if(this.grid[row].every(block => !(block instanceof EmptyBlock))){
                this.removeRow(row);
                row++;
            }
        }
    }

    /**
     * 
     * @param {Number} boardRow 
     */
    removeRow(boardRow){
        for(let column = 0; column < this.grid[boardRow].length; column++){
            this.grid[boardRow][column] = BlockFactory.createInstance(column, boardRow, false, BlockColor.EmptyWhite);
            for(let row = boardRow; row > 0; row--){
                const tmp = this.grid[row][column];
                this.grid[row][column] = this.grid[row-1][column];
                this.grid[row-1][column] = tmp;

                this.grid[row][column].boardY = row;
                this.grid[row-1][column].boardY = row-1;

                this.grid[row][column].update();
                this.grid[row-1][column].update();
            }
        }
    }

    /**
     * 
     */
    createCurrentShape(){
        /**
         * @type {Shape}
         */
        this.currentShape = ShapeFactory.createInstance();
        this.currentShape.position.x = GAME_BOARD_WIDTH/2 - 1;
        this.currentShape.position.y = 0;
    }

    dropCurrentShape(){
        const testShape = this.currentShape.clone();
        testShape.drop();

        if(this.validPosition(testShape)){
            this.currentShape.position.y = testShape.position.y;
        }
        else{
            this.collisionTime++;
        }
    }

    updateGhostShape(){
        this.currentGhostShape = this.currentShape.clone();
        this.currentGhostShape.makeGhost();

        while(this.validPosition(this.currentGhostShape)){
            this.currentGhostShape.drop();
        }

        this.currentGhostShape.moveUp();

    }

    handleMovement() {

        const testShape = this.currentShape.clone();

        let placeShape = false;
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
        else if(keys[" "]){
            while(this.validPosition(testShape)){
                testShape.drop();
            }
            testShape.moveUp();
            keys[" "] = false;
            didMove = true;
            placeShape = true;
           
        }

        if(didMove && this.validPosition(testShape)){
            
            if(!placeShape)
                this.currentShape = testShape;
            else{
                
                timer.tween(this.currentShape.position, ['y'], [testShape.position.y], 0.1, () => {
                    //this.currentShape.update();
                    this.onPlace()
                }); 
            }
                
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

        this.currentGhostShape.render();

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