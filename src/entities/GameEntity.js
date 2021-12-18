import Vector from "../../lib/Vector.js";

export default class GameEntity{

    /**
     * 
     * @param {Vector} dimensions 
     * @param {Vector} position 
     */
    constructor(dimensions, position){
        this.dimensions = dimensions;
        this.position = position;
        this.sprites = [];
        this.currentFrame = 0;
    }

    update(dt){

    }

    render() {
        
    }
}