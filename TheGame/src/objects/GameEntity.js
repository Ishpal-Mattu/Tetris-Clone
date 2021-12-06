export default class GameEntity{

    constructor(dimensions, position){
        this.dimensions = dimensions;
        this.position = position;
        this.sprites = [];
        this.currentFrame = 0;
    }

    update(dt){

    }

    render() {
        this.sprites[this.currentFrame].render(this.position.x, this.position.y);
    }
}