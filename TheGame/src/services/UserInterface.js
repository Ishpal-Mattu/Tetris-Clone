import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { canvas, context, images } from "../globals.js";
import GameBoard from "../objects/GameBoard.js";

export default class UserInterface {

    /**
     * Displays the game frame, current level, current score, next shape info and shape on hold.
     * @param {GameBoard} gameBoard 
     */
    constructor(gameBoard){
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.GameFrame),
            canvas.width, 
            canvas.height
        );
    }


    render(){
        // Draw the game frame
        this.sprites[0].render(0, 0);
    }
}