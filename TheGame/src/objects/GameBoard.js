import Vector from "../../lib/Vector.js";
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
        // Game board locations/size info
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.shapeStartPosition = new Vector(this.width/2 - 1, 0);

        /**
         * @type {Block[][]}
         */
        this.grid = this.getEmptyBoard();   // Creates grid with empty blocks

                
        // Create current + ghost + next shape
        this.createCurrentShape();
        this.updateGhostShape();
        /**
         * @type {Shape}
         */
        this.nextShape = ShapeFactory.createInstance();
        /**
         * @type {Shape}
         */
        this.holdShape = null;
        this.isHoldShapeAvailable = true;

        /**
         * @type {Shape[]}
         */
        this.placedShapes = [];     // Only here for debug purposes (not needed for game functionality).

        this.deltaTime = 0;     // Tracks the delta time
        this.dropDelay = 2;      // Time in sec to wait before automatically dropping current shape by 1 row

        //Time in sec to wait before placing the shape on collision
        //with floor or other shape. (time given is multiplied by the dropDelay)
        this.collisionDelay = this.dropDelay;    
        this.collisionTime = 0;     // Tracks the collision time
        this.slowDropShapes = true;  // Whether or not current shape should drop 1 row every dropDelay.

        // Game info
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.linesToLevelUp = 5;    // Lines needed per level in order to level up
        this.levelUpDropTimeChange = 0.75;  // % of dropTime to use each time we level up
        this.levelScorePerLine = {  // Score awarded for each line combos. (score should be multiplied by the level)
            0: 0,
            1: 100,
            2: 300,
            3: 500,
            4: 800
        }
        this.isGameOver = false;

        // Points awarded per row droped for soft and hard drop
        this.softDropScorePerRow = 1;
        this.hardDropScorePerRow = 2;
    }

    /**
     * 
     * @returns A 2D array filled with the EmptyBlock instances
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
		if(this.deltaTime >= this.dropDelay && this.slowDropShapes){
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
        this.isHoldShapeAvailable = true;
    }

    addScore(score){
        this.score += score;
    }

    onHoldShape(){
        this.isHoldShapeAvailable = false;

        // Switch hold & current shape
        const tmp = this.holdShape;
        this.holdShape = this.currentShape;
        this.currentShape = tmp;

        // Reset hold shape position
        this.holdShape.position.x = 0;
        this.holdShape.position.y = 0;
        this.holdShape.tetromino = this.holdShape.initializeTetrimono();

        if(!this.currentShape){
            this.startNextFall();
        }
        else{
            this.resetCurrentFall();
        }

    }

    onLevelUp(){
        this.level++;
        this.dropDelay *= this.levelUpDropTimeChange;
        this.collisionDelay *= this.levelUpDropTimeChange;
    }

    startNextFall() {
        this.slowDropShapes = true;
        this.currentShape = this.nextShape;
        this.currentShape.position.x = GAME_BOARD_WIDTH/2 -1;
        this.nextShape = ShapeFactory.createInstance();
        if(!this.validPosition(this.currentShape))
            this.isGameOver = true;
    }

    resetCurrentFall(){
        this.currentShape.position.x = this.shapeStartPosition.x;
        this.currentShape.position.y = this.shapeStartPosition.y;
        if(!this.validPosition(this.currentShape))
            this.isGameOver = true;
    }

    placeCurrentShape(){
        this.currentShape.onPlace();
        this.collisionTime = 0;
        this.placedShapes.push(this.currentShape);

        for(let x = 0; x < this.currentShape.dimensions.x; x++){
            for(let y = 0; y < this.currentShape.dimensions.y; y++){
                const block = this.currentShape.blockAt(x,y);
                
                const boardX = this.currentShape.position.x + x;
                const boardY = Math.floor(this.currentShape.position.y) + y;
                
                if(typeof(block) != "number"){
                    block.boardX = boardX;
                    block.boardY = boardY;
                    block.update();
                    console.log(this.grid);
                    console.log(this.grid[boardY][boardX]);
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
        let matchNum = 0;
        for(let row = this.height-1; row >= 0; row--){
            if(this.grid[row].every(block => !(block instanceof EmptyBlock))){
                this.removeRow(row);
                matchNum++;
                row++;
            }
        }

        this.addScore(this.levelScorePerLine[matchNum] * this.level);
        this.lines += matchNum;
        if(this.lines >= this.level * this.linesToLevelUp){
            this.onLevelUp();
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
        this.resetCurrentFall()
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

        if(keys.c){
            keys.c = false;
            if(this.isHoldShapeAvailable){
                this.onHoldShape();
                return;
            }
        }

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
            didMove = true;
		}
        else if(keys[" "]){
            let scoretoAdd = 0;
            do{
                testShape.drop();
                scoretoAdd += this.hardDropScorePerRow;
            }while(this.validPosition(testShape))
            testShape.moveUp();
            
            scoretoAdd -= this.hardDropScorePerRow;
            this.addScore(scoretoAdd);
            keys[" "] = false;
            didMove = true;
            placeShape = true;
           
        }

        if(didMove){

            if(this.validPosition(testShape))
            {
                if(keys.ArrowDown)
                    this.addScore(this.softDropScorePerRow);
                
                if(!placeShape)
                    this.currentShape = testShape;
                else{
                    const onPlaceCallback = this.onPlace.bind(this);
                    this.slowDropShapes = false;
                    timer.tween(this.currentShape.position, ['y'], [testShape.position.y], 0.1, onPlaceCallback); 
                }
            }
            
            keys.ArrowDown = false;
                
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

        // Render current ghost shape
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