import GameObject from "./GameObject.js";
import Vector from "../../lib/Vector.js";
import Animation from "../../lib/Animation.js"
import Sprite from "../../lib/Sprite.js"
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";

export default class Confetti extends GameObject{

    static TILE_SIZE = 512;

    /**
     * 
     * @param {Vector} dimensions 
     * @param {Vector} position 
     */
    constructor(dimensions, position){
        super(dimensions, position);

        this.sprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.Confetti), Confetti.TILE_SIZE, Confetti.TILE_SIZE);
        this.frames = this.loadFrames();
        this.animation = new Animation(this.frames, 0.05, 1);
    }

    update(dt){
        this.animation.update(dt);
        this.currentFrame = this.animation.getCurrentFrame();
    }

    render(){
        const canvasX = this.position.x - this.dimensions.x/2;
        const canvasY = this.position.y - this.dimensions.y/2;
        this.sprites[this.currentFrame].render(canvasX, canvasY);
    }

    /**
     * 
     * @returns {Number[]}
     */
    loadFrames(){
        const frames = [];
        for(let i = 0; i < this.sprites.length; i++){
            frames.push(i);
        }

        return frames;
    }

}