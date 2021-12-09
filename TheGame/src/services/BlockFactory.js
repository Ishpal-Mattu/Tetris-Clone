import Vector from "../../lib/Vector.js";
import BlockColor from "../enums/BlockColor.js";
import ImageName from "../enums/ImageName.js";
import Block from "../objects/Block.js";

export default class BlockFactory {
    static BLOCK_IMAGE = {
        Red: ImageName.RedBlock,
        Yellow: ImageName.YellowBlock,
        Blue: ImageName.BlueBlock,
        Lightblue: ImageName.LightBlueBlock,
        Purple: ImageName.PurpleBlock,
        Orange: ImageName.OrangeBlock,
        Green: ImageName.GreenBlock,
        Default: ImageName.BlackBlock,
    };

    /**
     * @param {Number} xInBoard X position in the game board
     * @param {Number} yInBoard Y position in the game board
     * @param {Boolean} isGhostBlock Whether it is a ghost block
     * @param {String} blockColor Color of the block
     * @returns Instance of a Block of the given color
     */
    static createInstance(xInBoard, yInBoard, isGhostBlock, blockColor=null){
        switch(blockColor){
            case BlockColor.Blue:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Blue, isGhostBlock);
            case BlockColor.Red:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Red, isGhostBlock);
            case BlockColor.Yellow:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Yellow, isGhostBlock);
            case BlockColor.LightBlue:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Lightblue, isGhostBlock);
            case BlockColor.Purple:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Purple, isGhostBlock);
            case BlockColor.Orange:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Orange, isGhostBlock);
            case BlockColor.Green:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Green, isGhostBlock);
            default:
                return new Block(new Vector(Block.WIDTH, Block.HEIGHT), new Vector(xInBoard, yInBoard), this.BLOCK_IMAGE.Default, isGhostBlock);
        }
    }
}