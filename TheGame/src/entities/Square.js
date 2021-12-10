import Vector from "../../lib/Vector.js";
import BlockColor from "../enums/BlockColor.js";
import ShapeType from "../enums/ShapeType.js";
import Block from "../objects/Block.js";
import BlockFactory from "../services/BlockFactory.js";
import Shape from "./Shape.js";

export default class Square extends Shape{

    static COLOR = BlockColor.Yellow;
    static WIDTH = 2;;
    static HEIGHT = 2;
    
     /**
     * Represents a square composed of Block.
     * @param {Boolean} isGhost 
     */
    constructor(isGhost){
        super(new Vector(Square.WIDTH, Square.HEIGHT), isGhost)

        this.tetromino = this.initializeTetrimono();
        this.type = ShapeType.o;
    }

    initializeTetrimono(){
        const tetromino = [{}, {}, {}, {}];

        for(let i = 0; i < tetromino.length; i++){
            if(typeof tetromino[i] !== "number"){
                
                tetromino[i] = BlockFactory.createInstance(this.position.x, this.position.y, this.isGhost, Square.COLOR);
            }
        }

        return tetromino;
    }

    /**
     * 
     */
     clone(){
        const superClone = super.clone();

        const clonedShape = new Square(this.isGhost);
        clonedShape.currentFrame = superClone.currentFrame;
        clonedShape.dimensions = new Vector(superClone.dimensions.x, superClone.dimensions.y);
        clonedShape.position = new Vector(superClone.position.x, superClone.position.y);
        clonedShape.sprites = [...superClone.sprites];
        clonedShape.tetromino = [...superClone.tetromino];
        clonedShape.type = superClone.type;           

        return clonedShape;
    }

}


