import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
} from "../globals.js";
import HighScoreManager from "../services/HighScoreManager.js";
import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ColorScheme from "../enums/ColorScheme.js";
import { roundRect } from "../../lib/CanvasHelper.js";
import SoundName from "../enums/SoundName.js";
import Confetti from "../objects/Confetti.js";
import Vector from "../../lib/Vector.js";

/**
 * Screen that allows us to input a new high score in the form of three characters, arcade-style.
 */
export default class EnterHighScoreState extends State {
	constructor() {
		super();

		this.chars = [65, 65, 65]; // Individual characters of our string.
		this.highlightedChar = 0; // Character that is currently highlighted.
        this.x = CANVAS_WIDTH / 4;
        this.y = CANVAS_HEIGHT / 4;
        this.width = CANVAS_WIDTH - this.x * 2;
        this.height = CANVAS_HEIGHT - this.y *2;
	}

	enter(parameters) {
		sounds.stop(SoundName.HighScore);
		sounds.play(SoundName.HighScore);
        this.gameBoard = parameters.gameBoard;
        this.gameInterface = parameters.userInterface;
		this.score = this.gameBoard.score;
		this.highlightedChar = 0;
        this.toggleBackgroundSounds();
		this.confetti = new Confetti(new Vector(Confetti.TILE_SIZE, Confetti.TILE_SIZE), new Vector(this.x + (this.width/2), this.y + (this.height/2)))
	}

	update(dt) {
		this.toggleBackgroundSounds();
		this.confetti.update(dt);
		if (keys.Enter) {
			keys.Enter = false;

			const name = String.fromCharCode(this.chars[0]) + String.fromCharCode(this.chars[1]) + String.fromCharCode(this.chars[2]);

			HighScoreManager.addHighScore(name, this.score);

			stateMachine.change(GameStateName.GameOver, {score: this.score});
		}

		// Scroll through character slots.
		if (keys.ArrowLeft) {
			keys.ArrowLeft = false;

            if(this.highlightedChar > 0){
			    this.highlightedChar = this.highlightedChar - 1;
				sounds.play(SoundName.Select);
			}
			else
				sounds.play(SoundName.NoSelect);
		}
		else if (keys.ArrowRight) {
			keys.ArrowRight = false;

            if(this.highlightedChar < 2){
			    this.highlightedChar = this.highlightedChar + 1;
				sounds.play(SoundName.Select);
			}
			else
				sounds.play(SoundName.NoSelect);
		}

		// Scroll through characters.
		if (keys.ArrowUp) {
			keys.ArrowUp = false;
			sounds.stop(SoundName.Select);
			sounds.play(SoundName.Select);
			this.chars[this.highlightedChar] = this.chars[this.highlightedChar] + 1;
			if (this.chars[this.highlightedChar] > 90) {
				this.chars[this.highlightedChar] = 65;
			}
		}
		else if (keys.ArrowDown) {
			keys.ArrowDown = false;
			sounds.stop(SoundName.Select);
			sounds.play(SoundName.Select);
			this.chars[this.highlightedChar] = this.chars[this.highlightedChar] - 1;
			if (this.chars[this.highlightedChar] < 65) {
				this.chars[this.highlightedChar] = 90;
			}
		}
	}

	render() {
		

        this.gameInterface.render();
        this.gameBoard.render();

		context.save();
        context.fillStyle = "white";
        roundRect(context, this.x, this.y, this.width, this.height, 10).fill();
        //context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = ColorScheme.Red;
		context.font = "20px Joystix";
		context.textAlign = 'center';
		context.fillText(`Your high score: ${this.score}`, this.width * 0.5 + this.x, this.height * 0.15 + this.y);
		context.font = "15px Joystix";
		context.fillText(`🢁/🢃 to choose a letter`, this.width * 0.5 + this.x, this.height * 0.3 + this.y);
		context.fillText(`🢀/🢂 to change slot`, this.width * 0.5 + this.x, this.height * 0.4 + this.y);
		context.font = "50px Joystix";
		context.fillStyle = this.highlightedChar === 0 ? ColorScheme.Blue : "grey";
		context.fillText(`${String.fromCharCode(this.chars[0])}`, this.width * 0.4 + this.x, this.height * 0.7 + this.y);
		context.fillStyle = this.highlightedChar === 1 ? ColorScheme.Blue : "grey";
		context.fillText(`${String.fromCharCode(this.chars[1])}`, this.width * 0.5 + this.x, this.height * 0.7 + this.y);
		context.fillStyle = this.highlightedChar === 2 ? ColorScheme.Blue : "grey";
		context.fillText(`${String.fromCharCode(this.chars[2])}`, this.width * 0.6 + this.x, this.height * 0.7 + this.y);
		context.fillStyle = ColorScheme.Red;
		context.font = "15px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Enter to confirm!`, this.width * 0.5 + this.x, this.height * 0.9 + this.y);
		context.restore();

		this.confetti.render();
	}

	toggleBackgroundSounds(){
		if(sounds.mute)
			sounds.pause(SoundName.MenuBackground);
		else
			sounds.play(SoundName.MenuBackground);
	}
}
