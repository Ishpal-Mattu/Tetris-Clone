export default class GameBoard {

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} level 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(x, y, level, width, height){
        this.x = x;
        this.y = y;
        this.level = level;
        this.width = width;
        this.height = height;
    }
}