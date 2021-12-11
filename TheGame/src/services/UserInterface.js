import Sprite from "../../lib/Sprite.js";
import ColorScheme from "../enums/ColorScheme.js";
import ImageName from "../enums/ImageName.js";
import ShapeType from "../enums/ShapeType.js";
import { BLOCK_SIZE, canvas, CANVAS_WIDTH, context, images } from "../globals.js";
import GameBoard from "../objects/GameBoard.js";

export default class UserInterface {

    /**
     * Displays the game frame, current level, current score, next shape info and shape on hold.
     * @param {GameBoard} gameBoard 
     */
    constructor(gameBoard){

        this.gameBoard = gameBoard;

        // Values taken from game frame using paint

        this.nextFrameY = 42;
        this.nextFrameInnerY = 50;
        this.holdFrameY = 250;
        this.holdFrameInnerY = 258;

        this.rightFrameInnerX = 607;
        this.rightFrameTextHeight = 190 - this.nextFrameInnerY;       
        this.rightFrameTextWidth = 747 - this.rightFrameInnerX;

        this.rightFrameX = 597;
        this.rightFrameWidth = 762 - this.rightFrameX;
        this.rightFrameHeight = 202 - this.nextFrameY;


        // Values taken from game frame using paint
        this.leftTextX = 90;
        this.frameTextWidth = 160-25;

        this.levelY = 261;
        this.scoreY = 112;
        this.lineY = 409;

        this.leftFrameX = 15;
        this.leftFrameWidth = 150;
        this.frameTitleCanvasHeight = 41.5;
        
        this.scoreFrameY = 45;
        this.levelFrameY = 193;
        this.lineFrameY = 341;

        this.sprites = UserInterface.generateSprite();

        this.gameFrameSpriteIndex = 0;
        this.shapeFrameSpriteIndex = 1;


    }

    update(){
        this.gameBoard.nextShape.update();
        this.gameBoard.holdShape?.update();
    }


    render(){
        // Draw the game frame, next shape frame & hold shape frame
        this.sprites[this.gameFrameSpriteIndex].render(0, 0);
        this.sprites[this.shapeFrameSpriteIndex].render(this.rightFrameX, this.nextFrameY);
        this.sprites[this.shapeFrameSpriteIndex].render(this.rightFrameX, this.holdFrameY);

        // Display Next Shape
        const nextShapeRenderX = this.rightFrameInnerX + (this.rightFrameTextWidth - this.gameBoard.nextShape.dimensions.x * BLOCK_SIZE)/2
        const nextShapeRenderY = this.nextFrameInnerY + (this.rightFrameTextHeight - this.gameBoard.nextShape.dimensions.y * BLOCK_SIZE)/2
        this.gameBoard.nextShape.render(nextShapeRenderX + this.determineShapeXOfset(this.gameBoard.nextShape), nextShapeRenderY + this.determineShapeYOfset(this.gameBoard.nextShape))

        // Display Hold Shape if any
        if(this.gameBoard.holdShape){
            const holdShapeRenderX = this.rightFrameInnerX + (this.rightFrameTextWidth - this.gameBoard.holdShape.dimensions.x * BLOCK_SIZE)/2
            const holdShapeRenderY = this.holdFrameInnerY + (this.rightFrameTextHeight - this.gameBoard.holdShape.dimensions.y * BLOCK_SIZE)/2;
            this.gameBoard.holdShape.render(holdShapeRenderX + this.determineShapeXOfset(this.gameBoard.holdShape), holdShapeRenderY + this.determineShapeYOfset(this.gameBoard.holdShape));    
        }
        
        context.save();
        context.font = "40px Tetris2";
        context.textBaseline = 'middle';
        context.textAlign = "center";
        
        // Display Level, Score & Lines
        context.fillText(this.gameBoard.level.toString(), this.leftTextX, this.levelY, this.frameTextWidth);
        context.fillText(this.gameBoard.score.toString(), this.leftTextX, this.scoreY, this.frameTextWidth);
        context.fillText(this.gameBoard.lines.toString(), this.leftTextX, this.lineY, this.frameTextWidth);

        // Draw white rectangle in each info frame so we can write on top
        context.fillStyle = "#ffff";
        context.fillRect(this.leftFrameX, this.scoreFrameY, this.leftFrameWidth, this.frameTitleCanvasHeight)
        context.fillRect(this.leftFrameX, this.levelFrameY, this.leftFrameWidth, this.frameTitleCanvasHeight)
        context.fillRect(this.leftFrameX, this.lineFrameY, this.leftFrameWidth, this.frameTitleCanvasHeight)

        // Write the title for each info frame
        context.font = "30px LiquidItalic";
        context.fillStyle = "#6ec6e8";
        context.fillText("Score", this.leftFrameWidth/2 + this.leftFrameX, this.frameTitleCanvasHeight/2 + this.scoreFrameY, this.leftFrameWidth)
        context.fillText("Level", this.leftFrameWidth/2 + this.leftFrameX, this.frameTitleCanvasHeight/2 + this.levelFrameY, this.leftFrameWidth)
        context.fillText("Lines", this.leftFrameWidth/2 + this.leftFrameX, this.frameTitleCanvasHeight/2 + this.lineFrameY, this.leftFrameWidth)
        
        context.font = "40px LiquidItalic";
        context.fillText("Next", this.rightFrameWidth/2 + this.rightFrameX, this.rightFrameHeight + this.nextFrameY);
        context.fillText("Hold", this.rightFrameWidth/2 + this.rightFrameX, this.rightFrameHeight + this.holdFrameY);
        context.restore();

        
    }

    determineShapeXOfset(shape){
        switch(shape.type){
            default: return 0
        }
    }
    determineShapeYOfset(shape){
        switch(shape.type){
            case(ShapeType.i ): return BLOCK_SIZE/2;
            case(ShapeType.j ): return BLOCK_SIZE/2;
            case(ShapeType.l ): return BLOCK_SIZE/2;
            case(ShapeType.s ): return BLOCK_SIZE/2;
            case(ShapeType.t ): return BLOCK_SIZE/2;
            case(ShapeType.z ): return BLOCK_SIZE/2;
            default: return 0;
        }
    }

    static generateSprite(){
        // Magic numbers here are of x/y positions of the game frame sprite using paint.
        const nextFrameX = 597;
        const nextFrameWidth = 762 - nextFrameX;
        const nextFrameY = 42;
        const nextFrameHeight = 202 - nextFrameY;

        const gameFrameX = 0;
        const gameFrameY = 0;
        const gameFrameWidth = 589 - gameFrameX;
        const gameFrameHeight = images.get(ImageName.GameFrame).height;

        const sprites = [];

        sprites.push(new Sprite(images.get(ImageName.GameFrame), gameFrameX, gameFrameY, gameFrameWidth, gameFrameHeight));
        sprites.push(new Sprite(images.get(ImageName.GameFrame), nextFrameX, nextFrameY, nextFrameWidth, nextFrameHeight));
    
        return sprites;
    }

}