import Vector from "../../lib/Vector.js";
import BlockColor from "../enums/BlockColor.js";
import ShapeType from "../enums/ShapeType.js";
import BlockFactory from "../services/BlockFactory.js";
import Shape from "./Shape.js";

export default class SShape extends Shape{

    static COLOR = BlockColor.Green;
    static WIDTH = 3;
    static HEIGHT = 3;
     /**
     * Represents a square composed of Block.
     * @param {Boolean} isGhost 
     */
    constructor(isGhost){
        super(new Vector(SShape.WIDTH, SShape.HEIGHT), isGhost)

        this.tetromino = this.initializeTetrimono();
        this.type = ShapeType.s;
    }

    initializeTetrimono(){
        const tetromino = [0, {}, {}, {}, {}, 0, 0, 0, 0];

        for(let i = 0; i < tetromino.length; i++){
            if(typeof tetromino[i] !== "number"){
                
                tetromino[i] = BlockFactory.createInstance(this.position.x, this.position.y, this.isGhost, SShape.COLOR);
            }
        }

        return tetromino;
    }

    /**
     * 
     */
     clone(){
        const superClone = super.clone();

        const clonedShape = new SShape(this.isGhost);
        Object.assign(clonedShape, superClone);        

        return clonedShape;
    }
}