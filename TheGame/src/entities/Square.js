import Vector from "../../lib/Vector.js";
import BlockColor from "../enums/BlockColor.js";
import Block from "../objects/Block.js";
import BlockFactory from "../services/BlockFactory.js";
import Shape from "./Shape.js";

export default class Square extends Shape{

    static COLOR = BlockColor.Yellow;
    
     /**
     * Represents a square composed of Block.
     * @param {Boolean} isGhost 
     */
    constructor(isGhost){
        super(Shape.SIZE, isGhost)

        this.tetromino = this.initializeTetrimono();
    }

    initializeTetrimono(){
        const tetromino = [0, 0, 0, 0, 0, {}, {}, 0, 0, {}, {}, 0, 0, 0, 0, 0];

        for(let i = 0; i < tetromino.length; i++){
            if(typeof tetromino[i] !== "number"){
                
                tetromino[i] = BlockFactory.createInstance(this.position.x, this.position.y, this.isGhost, Square.COLOR);
            }
        }

        return tetromino;
    }
}