import Vector from "../../lib/Vector.js";
import BlockColor from "../enums/BlockColor.js";
import BlockFactory from "../services/BlockFactory.js";
import Shape from "./Shape.js";
import Square from "./Square.js";

export default class LShape extends Shape{

    static COLOR = BlockColor.Orange;
    static WIDTH = 4;
    static HEIGHT = 4;
     /**
     * Represents a square composed of Block.
     * @param {Boolean} isGhost 
     */
    constructor(isGhost){
        super(Shape.SIZE, isGhost)

        this.tetromino = this.initializeTetrimono();
    }

    initializeTetrimono(){
        const tetromino = [0, {}, 0, 0, 0, {}, 0, 0, 0, {}, {}, 0, 0, 0, 0, 0];

        for(let i = 0; i < tetromino.length; i++){
            if(typeof tetromino[i] !== "number"){
                
                tetromino[i] = BlockFactory.createInstance(this.position.x, this.position.y, this.isGhost, LShape.COLOR);
            }
        }

        return tetromino;
    }
}