import Vector from "../../lib/Vector.js";
import GameEntity from "./GameEntity.js";
import Block from "../objects/Block.js";
import { GAME_BOARD_X, GAME_BOARD_Y } from "../globals.js";

export default class Shape extends GameEntity{
    
    
    /**
     * Represents a shape composed of 1 or more Block.
     * This abstract class should not be instantiated directly.
     * @param {Vector} dimensions the width and height of the shape represented by the number of Block.
     * @param {Boolean} isGhost 
     */
    constructor(dimensions, isGhost){
        super(dimensions, new Vector(0, 0));

        this.isGhost = isGhost;
        this.tetromino = this.initializeTetrimono();
        this.type = null;
        this.isPlaced = false;
        this.cleanUp = false;
    }

    makeGhost(){
        this.isGhost = true;
        this.tetromino.forEach(block => {
                if(block instanceof Block){
                    block.isGhost = true;
                }
            }
        )
    }

    onPlace(){
        this.isPlaced = true;
        this.tetromino.forEach(block => {
            if(block instanceof Block){
                block.isPlaced = true;
            }
        })
    }

    onCleanup(){
        this.cleanUp = true;
    }

    rotate(){
        let grid = [];

        for(let i = 0; i < this.dimensions.x * this.dimensions.y; i++){

            // Convert to x and y
            let x1 = i % this.dimensions.x;
            let y1 = Math.floor(i / this.dimensions.x);

            // The new x and y
            let x2 = this.dimensions.x - y1 - 1;
            let y2 = x1;

            // Get index with formula
            let gridIndex = y2 * this.dimensions.x + x2;
            grid[gridIndex] = this.tetromino[i];
        }

        this.tetromino = grid;
    }

    /**
     * 
     */
    moveRight(){
        this.position.x++;
    }

    /**
     * 
     */
    moveLeft(){
        this.position.x--;
    }

    /**
     * 
     */
    drop(){
        this.position.y++;
    }

    moveUp(){
        this.position.y--;
    }

    getBlocks(){
        return this.tetromino;
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Block | Number}
     */
    blockAt(x, y){
        //(x,y) => { list[4*y + x] }

        return this.tetromino[this.dimensions.x * y + x];
    }

    update(){
        for(let i = 0; i<this.tetromino.length; i++){
            let block = this.tetromino[i];
            if(block instanceof Block){
                block.boardX = this.position.x + i % this.dimensions.x;
                block.boardY = this.position.y + Math.floor(i/this.dimensions.x);
                block.update();
            }
            
        }
    }

    render(x = GAME_BOARD_X, y = GAME_BOARD_Y){
        for(let i = 0; i<this.tetromino.length; i++){
            let block = this.tetromino[i];
            if(block instanceof Block){
                block.render(x, y);
            }
            
        }
    }

    initializeTetrimono(){
        return [];
    }

    /**
     * 
     */
    clone(){
        const clonedShape = new Shape(new Vector(this.dimensions.x, this.dimensions.y), this.isGhost);
        clonedShape.currentFrame = this.currentFrame;
        clonedShape.dimensions = new Vector(this.dimensions.x, this.dimensions.y);
        clonedShape.position = new Vector(this.position.x, this.position.y);
        clonedShape.sprites = [...this.sprites];
        
        clonedShape.type = this.type;

        for(let i = 0; i < this.tetromino.length; i++){
            const block = this.tetromino[i];
            if(block instanceof Block){
                clonedShape.tetromino.push(block.clone());
            }
            else
            {
                clonedShape.tetromino.push(block);
            }
        }

        return clonedShape;
    }
}