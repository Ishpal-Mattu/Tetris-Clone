import Vector from "../../lib/Vector.js";
import ColorScheme from "../enums/ColorScheme.js";
import { context } from "../globals.js";
import Block from "./Block.js";

export default class EmptyBlock extends Block{

    /**
     * 
     * @param {Vector} dimension 
     * @param {Vector} position 
     */
    constructor(dimension, position){
        super(dimension, position)
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    render(x, y){
        context.save();
        context.strokeStyle = ColorScheme.Blue;

        
        context.globalAlpha = 0.1;
        
        context.strokeRect(this.position.x + x, this.position.y + y, this.dimensions.x, this.dimensions.y);

        context.restore();
    }

    clone(){
        const superClone = super.clone();

        const clonedBlock = new EmptyBlock(superClone.dimensions, superClone.position);
        clonedBlock.sprites = superClone.sprites;
        clonedBlock.boardX = superClone.boardX;
        clonedBlock.boardY = superClone.boardY;
        clonedBlock.cleanUp = superClone.cleanUp;
        clonedBlock.currentFrame = superClone.currentFrame;
        clonedBlock.isCollidable = superClone.isCollidable;
        clonedBlock.isGhost = superClone.isGhost;
        clonedBlock.isPlaced = superClone.isPlaced;
        clonedBlock.isSolid = superClone.isSolid;
        clonedBlock.wasCollided = superClone.wasCollided;

        return clonedBlock;
    }
}