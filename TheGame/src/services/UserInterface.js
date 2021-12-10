import Sprite from "../../lib/Sprite.js";
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

        const nextShapeRenderX = this.frameNextX + (this.frameNextWidth - this.gameBoard.nextShape.dimensions.x * BLOCK_SIZE)/2
        const nextShapeRenderY = this.frameNextY + (this.frameNextHeight - this.gameBoard.nextShape.dimensions.y * BLOCK_SIZE)/2



        // Display Next Shape
        this.gameBoard.nextShape.render(nextShapeRenderX + this.determineNextShapeXOfset(), nextShapeRenderY + this.determineNextShapeYOfset())
    }

    determineNextShapeXOfset(){
        switch(this.gameBoard.nextShape.type){
            case(ShapeType.i ): return -BLOCK_SIZE/2;
            case(ShapeType.j ): return -BLOCK_SIZE/2;
            case(ShapeType.l ): return BLOCK_SIZE/2;
            case(ShapeType.o ): return 0;
            case(ShapeType.s ): return 0;
            case(ShapeType.t ): return 0;
            case(ShapeType.z ): return 0;
        }
    }
    determineNextShapeYOfset(){
        switch(this.gameBoard.nextShape.type){
            case(ShapeType.i ): return 0;
            case(ShapeType.j ): return 0;
            case(ShapeType.l ): return 0;
            case(ShapeType.o ): return 0;
            case(ShapeType.s ): return BLOCK_SIZE/2;
            case(ShapeType.t ): return BLOCK_SIZE/2;
            case(ShapeType.z ): return BLOCK_SIZE/2;
        }
    }

}