import Game from "../../lib/Game.js";
import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, keys, sounds, stateMachine} from "../globals.js";
import GameBoard from "../objects/GameBoard.js";
import HighScoreManager from "../services/HighScoreManager.js";
import UserInterface from "../services/UserInterface.js";

export default class PlyState extends State {
	constructor() {
		super();
		//console.log(this.gameBoard.grid);

		this.deltaTime = 0;
		//(x,y) => { list[4*y + x] }
	}

	enter(parameters){
		this.gameBoard = new GameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
		this.userInterface = new UserInterface(this.gameBoard);
		this.deltaTime = 0;
		this.toggleBackgroundSounds();
	}

	update(dt){
		this.toggleBackgroundSounds();
		this.gameBoard.update(dt);
		this.userInterface.update();

		if(this.gameBoard.isGameOver){
			if(this.wasHighScore(this.gameBoard.score)){
				sounds.stop(SoundName.GameBackground)
				stateMachine.change(GameStateName.EnterHighScore, {gameBoard: this.gameBoard, userInterface: this.userInterface});
			}
			else{
				sounds.stop(SoundName.GameOver);
				sounds.play(SoundName.GameOver);
				sounds.stop(SoundName.GameBackground);
				stateMachine.change(GameStateName.GameOver, {score: this.gameBoard.score});
			}
		}
		
	}

	render(){
		this.userInterface.render();
		this.gameBoard.render();
	}

	exit(){
		
	}

	wasHighScore(score) {
		return HighScoreManager.loadHighScores().some((highScore) => score > highScore.score);
	}

	toggleBackgroundSounds(){
		if(sounds.mute)
			sounds.pause(SoundName.GameBackground);
		else
			sounds.play(SoundName.GameBackground);
	}
}
