import Vector from "../../lib/Vector.js";
import GameEntity from "./GameEntity.js";
import Direction from "../enums/Direction.js";

export default class Shape extends GameEntity{
    
    /**
     * Represents a shape composed of 1 or more Block.
     * This abstract class should not be instantiated directly.
     * @param {Vector} dimensions the width and height of the shape represented by the number of Block.
     * @param {Vector} position the x and y gameboard position of the shape 
     * @param {Boolean} isGhost 
     */
    constructor(dimensions, position, isGhost){
        super(dimensions, position);

        this.isGhost = isGhost;
        this.direction = Direction.Up;
        this.blocks = [];
    }

    rotate(){
        
    }

    moveRight(gameboard){

    }

    moveLeft(gameboard){

    }

    drop(gameboard){

    }

    instantDrop(gameboard){

    }



}