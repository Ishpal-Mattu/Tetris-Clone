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
        this.frameNextX = 607;
        this.frameNextY = 50;
        this.frameNextHeight = 190 - this.frameNextY;       
        this.frameNextWidth = 747 - this.frameNextX;

        // Values taken from game frame using paint
        this.leftTextX = 90;
        this.frameTextWidth = 160-25;

        this.levelY = 261;
        this.scoreY = 112;
        this.lineY = 409;

        this.frameX = 15;
        this.frameWidth = 150;
        this.frameTitleCanvasHeight = 41.5;
        
        this.scoreFrameY = 45;
        this.levelFrameY = 193;
        this.lineFrameY = 341;

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.GameFrame),
            canvas.width, 
            canvas.height
        );
    }

    update(){
        this.gameBoard.nextShape.update();
    }


    render(){
        // Draw the game frame
        this.sprites[0].render(0, 0);

        // Display Next Shape
        const nextShapeRenderX = this.frameNextX + (this.frameNextWidth - this.gameBoard.nextShape.dimensions.x * BLOCK_SIZE)/2
        const nextShapeRenderY = this.frameNextY + (this.frameNextHeight - this.gameBoard.nextShape.dimensions.y * BLOCK_SIZE)/2
        this.gameBoard.nextShape.render(nextShapeRenderX + this.determineNextShapeXOfset(), nextShapeRenderY + this.determineNextShapeYOfset())

        context.save();
        //context.font = "50px MinecraftEvenings";
        context.font = "40px Tetris2";
        context.textBaseline = 'middle';
        context.textAlign = "center";
        
        // Display Level, Score & Lines
        context.fillText(this.gameBoard.level.toString(), this.leftTextX, this.levelY, this.frameTextWidth);
        context.fillText(this.gameBoard.score.toString(), this.leftTextX, this.scoreY, this.frameTextWidth);
        context.fillText(this.gameBoard.lines.toString(), this.leftTextX, this.lineY, this.frameTextWidth);

        // Draw white rectangle in each info frame so we can write on top
        context.fillStyle = "#ffff";
        context.fillRect(this.frameX, this.scoreFrameY, this.frameWidth, this.frameTitleCanvasHeight)
        context.fillRect(this.frameX, this.levelFrameY, this.frameWidth, this.frameTitleCanvasHeight)
        context.fillRect(this.frameX, this.lineFrameY, this.frameWidth, this.frameTitleCanvasHeight)

        // Write the title for each info frame
        context.font = "30px LiquidItalic";
        context.fillStyle = "#6ec6e8";
        context.fillText("Score", this.frameWidth/2 + this.frameX, this.frameTitleCanvasHeight/2 + this.scoreFrameY, this.frameWidth)
        context.fillText("Level", this.frameWidth/2 + this.frameX, this.frameTitleCanvasHeight/2 + this.levelFrameY, this.frameWidth)
        context.fillText("Lines", this.frameWidth/2 + this.frameX, this.frameTitleCanvasHeight/2 + this.lineFrameY, this.frameWidth)

        context.restore();

        
    }

    determineNextShapeXOfset(){
        switch(this.gameBoard.nextShape.type){
            case(ShapeType.i ): return -BLOCK_SIZE/2;
            case(ShapeType.j ): return -BLOCK_SIZE/2;
            case(ShapeType.l ): return BLOCK_SIZE/2;
            default: return 0
        }
    }
    determineNextShapeYOfset(){
        switch(this.gameBoard.nextShape.type){
            case(ShapeType.s ): return BLOCK_SIZE/2;
            case(ShapeType.t ): return BLOCK_SIZE/2;
            case(ShapeType.z ): return BLOCK_SIZE/2;
            default: return 0;
        }
    }

}