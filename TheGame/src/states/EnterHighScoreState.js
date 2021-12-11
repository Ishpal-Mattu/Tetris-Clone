import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine,
} from "../globals.js";
import HighScoreManager from "../services/HighScoreManager.js";
import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";

/**
 * Screen that allows us to input a new high score in the form of three characters, arcade-style.
 */
export default class EnterHighScoreState extends State {
	constructor() {
		super();

		this.chars = [65, 65, 65]; // Individual characters of our string.
		this.highlightedChar = 0; // Character that is currently highlighted.
        this.x = CANVAS_WIDTH / 3;
        this.y = CANVAS_HEIGHT / 4;
        this.width = CANVAS_WIDTH - this.x * 2;
        this.height = CANVAS_HEIGHT - this.y *2;
	}

	enter(parameters) {
        this.gameBoard = parameters.gameBoard;
        this.gameInterface = parameters.userInterface;
		this.score = this.gameBoard.score;
		this.highlightedChar = 0;
        
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;

			const name = String.fromCharCode(this.chars[0]) + String.fromCharCode(this.chars[1]) + String.fromCharCode(this.chars[2]);

			HighScoreManager.addHighScore(name, this.score);

			stateMachine.change(GameStateName.GameOver);
		}

		// Scroll through character slots.
		if (keys.a && this.highlightedChar > 0) {
			keys.a = false;
			this.highlightedChar = this.highlightedChar - 1;

            // TODO : Play select sound
			//sounds.select.play();
		}
		else if (keys.d && this.highlightedChar < 2) {
			keys.d = false;
			this.highlightedChar = this.highlightedChar + 1;

            // TODO : Play select sound
			//sounds.select.play();
		}

		// Scroll through characters.
		if (keys.w) {
			keys.w = false;
			this.chars[this.highlightedChar] = this.chars[this.highlightedChar] + 1;
			if (this.chars[this.highlightedChar] > 90) {
				this.chars[this.highlightedChar] = 65;
			}
		}
		else if (keys.s) {
			keys.s = false;
			this.chars[this.highlightedChar] = this.chars[this.highlightedChar] - 1;
			if (this.chars[this.highlightedChar] < 65) {
				this.chars[this.highlightedChar] = 90;
			}
		}
	}

	render() {
		//images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.gameInterface.render();
        this.gameBoard.render();

		context.save();
		context.fillStyle = "white";
		context.font = "20px Joystix";
		context.textAlign = 'center';
		context.fillText(`Your high score: ${this.score}`, this.width * 0.5 + this.x, this.height * 0.15 + this.y);
		context.font = "15px Joystix";
		context.fillText(`W/S to choose a letter`, this.width * 0.5 + this.x, this.height * 0.3 + this.y);
		context.fillText(`A/D to change slot`, this.width * 0.5 + this.x, this.height * 0.4 + this.y);
		context.font = "50px Joystix";
		context.fillStyle = this.highlightedChar === 0 ? "cornflowerblue" : "white";
		context.fillText(`${String.fromCharCode(this.chars[0])}`, this.width * 0.4 + this.x, this.height * 0.7 + this.y);
		context.fillStyle = this.highlightedChar === 1 ? "cornflowerblue" : "white";
		context.fillText(`${String.fromCharCode(this.chars[1])}`, this.width * 0.5 + this.x, this.height * 0.7 + this.y);
		context.fillStyle = this.highlightedChar === 2 ? "cornflowerblue" : "white";
		context.fillText(`${String.fromCharCode(this.chars[2])}`, this.width * 0.6 + this.x, this.height * 0.7 + this.y);
		context.fillStyle = "white";
		context.font = "10px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Enter to confirm!`, this.width * 0.5 + this.x, this.height * 0.9 + this.y);
		context.restore();
	}
}
