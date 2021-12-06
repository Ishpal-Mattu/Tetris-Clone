export default class GameTracker{

    constructor(nextBlock, holdBlock = null, score = 0, level = 1){
        this.score = score;
        this.level = level;
        this.nextBlock = nextBlock;
        this.holdBlock = holdBlock;
    }
}