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
    static EMPTY_SPACE = 0;
    static BLOCK_SPACE = 1;

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
        return Array.from(
            {length: this.height}, () => Array(this.width).fill(GameBoard.EMPTY_SPACE)
        );
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
        
        for(let x = 0; x < this.currentShape.dimensions.x; x++){
            for(let y = 0; y < this.currentShape.dimensions.y; y++){
                if(this.currentShape.blockAt(x,y) instanceof Block){
                    const boardX = this.currentShape.position.x + x;
                    const boardY = this.currentShape.position.y + y;

                    this.grid[boardY][boardX] = GameBoard.BLOCK_SPACE;
                }
            }
        }
    }

    /**
     * 
     * @param {Number} startRow 
     * @param {Number} endRow 
     */
    checkRowMatch(startRow, endRow){
        for(let i = endRow; i > startRow; i--){
            if(this.grid[i].every(block => block === GameBoard.BLOCK_SPACE)){

            }
        }
    }

    /**
     * 
     * @param {Number} boardRow 
     */
    removeRow(boardRow){
        this.grid[boardRow].fill(GameBoard.EMPTY_SPACE);
        
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
                    if(shape.blockAt(x, y) instanceof Block && this.grid[shape.position.y + y][shape.position.x + x] != 0 ){
                        return false;
                    }
                    
                } catch (error) {
                    return false;
                }
                
            }
        }

        return true;
    }

    // /**
    //  * Determines if there is a placed shape in the given game board position
    //  * @param {Number} boardY
    //  * @param {Number} boardX
    //  */
    // isOverlappingOtherShapes(boardY, boardX){
    //     this.placedShapes.forEach(shape => {
    //         for(let x = 0; x < shape.dimensions.x; x++){
    //             for(let y = 0; y < shape.dimensions.y ; y++){
    //                 if(shape.blockAt(x,y) instanceof Block && (shape.position.y + y === boardY && shape.position.x + x === boardX)){
    //                     return true;
    //                 }
    //             }
    //         }
    //     })

    //     return false;
    // }

    render(){
        let x = GameBoard.XPOS;
        let y = GameBoard.YPOS;

        // Renders all shapes in the game area (current shape & placed shapes) (the shape renders each block)
        this.renderAllShape();

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

    /**
     * Renders all shapes in the game area.
     */
    renderAllShape(){
        this.currentShape.render();
        this.placedShapes.forEach( shape => {
            shape.render();
        })
    }
}