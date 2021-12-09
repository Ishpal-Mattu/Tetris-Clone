import { getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import LShape from "../entities/LShape.js";
import Square from "../entities/Square.js";
import ShapeType from "../enums/ShapeType.js";

export default class ShapeFactory{
    
    /**
     * 
     * @param {String} shapeType The shape type to create. If null, a random shape will be returned. Null by default.
     * @param {Boolean} isGhost Wheter it is a ghost shape. False by default.
     */
    static createInstance(shapeType = null, isGhost = false){
        
        if(shapeType === null)
            shapeType = this.getRandomShape();

        switch(shapeType){
            case ShapeType.l: return new LShape(isGhost);
            default: return new Square(isGhost);
        }
    }

    /**
     * 
     * @returns A random shape type
     */
    static getRandomShape(){
        let randomInt = getRandomPositiveInteger(1, 7);

        switch(randomInt){
            case 1: return ShapeType.i;
            case 2: return ShapeType.j;
            case 3: return ShapeType.l;
            case 4: return ShapeType.o;
            case 5: return ShapeType.s;
            case 6: return ShapeType.t;
            default: return ShapeType.z;
        }
    }
}