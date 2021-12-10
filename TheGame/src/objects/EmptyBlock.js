import Vector from "../../lib/Vector.js";
import { context } from "../globals.js";
import Block from "./Block.js";

export default class EmptyBlock extends Block{

    /**
     * 
     * @param {Vector} dimension 
     * @param {Vector} position 
     */
    constructor(dimension, position){
        super(dimension, position)
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    render(x, y){
        context.save();

        if(this.isGhost)
            context.globalAlpha = 0.4;
        
        context.strokeRect(this.position.x + x, this.position.y + y, this.dimensions.x, this.dimensions.y);

        context.restore();
    }
}