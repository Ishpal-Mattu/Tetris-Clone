import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { context, images, BLOCK_SIZE } from "../globals.js";
import GameObject from "./GameObject.js";

export default class Block extends GameObject{
    
    static WIDTH = BLOCK_SIZE;
    static HEIGHT = BLOCK_SIZE;

    /**
     * The individual blocks that make up a shape.
     * 
     * @param {Vector} dimension the width and height of the block
     * @param {Vector} position the x and y board position of the block
     * @param {String} imageName the image name to use as sprite
     * @param {Boolean} isGhost whether the block should be rendered as a ghost block
     */
    constructor(dimension, position, imageName = ImageName.BlackBlock, isGhost = false){
        super(dimension, position);

        // Board position
        this.boardX = position.x;
        this.boardY = position.y;

        // Canvas board position
        this.position.x = this.boardX * dimension.x;
        this.position.y = this.boardY * dimension.y;

        // Block info
        this.isCollidable = true;
        this.isSolid = true;
        this.isPlaced = false;
        this.isGhost = isGhost;

        const imageGraphic = images.get(imageName);
        this.sprites = Sprite.generateSpritesFromSpriteSheet(imageGraphic, Block.WIDTH, Block.HEIGHT);
    }

    update(){
        this.position.x = this.boardX * this.dimensions.x;
        this.position.y = this.boardY * this.dimensions.y;
    }

    render(x, y){
        context.save();

        if(this.isGhost)
            context.globalAlpha = 0.25;
        
        this.sprites[this.currentFrame].render(this.position.x + x, this.position.y + y);

        context.restore();

    }

    clone(){
        const clonedBlock = new Block(new Vector(this.dimensions.x, this.dimensions.y), new Vector(this.position.x, this.position.y), ImageName.BlackBlock, this.isGhost)
        clonedBlock.sprites = [...this.sprites];
        clonedBlock.boardX = this.boardX;
        clonedBlock.boardY = this.boardY;
        clonedBlock.cleanUp = this.cleanUp;
        clonedBlock.currentFrame = this.currentFrame;
        clonedBlock.isCollidable = this.isCollidable;
        clonedBlock.isGhost = this.isGhost;
        clonedBlock.isPlaced = this.isPlaced;
        clonedBlock.isSolid = this.isSolid;
        clonedBlock.wasCollided = this.wasCollided;

        return clonedBlock;
    }
    

}