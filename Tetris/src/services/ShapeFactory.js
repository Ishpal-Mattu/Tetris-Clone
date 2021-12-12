import { getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import IShape from "../entities/IShape.js";
import JShape from "../entities/JShape.js";
import LShape from "../entities/LShape.js";
import Square from "../entities/Square.js";
import SShape from "../entities/SShape.js";
import TShape from "../entities/TShape.js";
import ZShape from "../entities/ZShape.js";
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
            
            case ShapeType.i: return new IShape(isGhost);
            case ShapeType.j: return new JShape(isGhost);
            case ShapeType.l: return new LShape(isGhost);
            case ShapeType.o: return new Square(isGhost);
            case ShapeType.s: return new SShape(isGhost);
            case ShapeType.t: return new TShape(isGhost);
            default: return new ZShape(isGhost);
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