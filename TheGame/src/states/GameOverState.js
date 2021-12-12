import { roundRect } from "../../lib/CanvasHelper.js";
import State from "../../lib/State.js";
import ColorScheme from "../enums/ColorScheme.js";
import GameStateName from "../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, stateMachine } from "../globals.js";
import HighScoreManager from "../services/HighScoreManager.js";

export default class GameOverState extends State {
	constructor() {
		super();
	}

	enter(parameters){
		this.score = parameters.score;
		this.highScores = HighScoreManager.loadHighScores();
	}

	update(dt){
		if(keys.Enter){
			keys.Enter = false;

			stateMachine.change(GameStateName.Play);

		}

		if(keys.Escape){
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render(){
		context.globalAlpha = 0.8;
		images.render("blockBackground", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.globalAlpha = 1;

		context.save();
		context.fillStyle = 'white';
		context.font = "100px Joystix";
		context.textAlign = 'center';
		context.fillText(`Game Over`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);

		context.font = "30px Joystix";
		context.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.2);


		context.font = "40px Joystix";
		context.fillStyle = 'white'   //'#5098c4';
		const highScoreX = CANVAS_WIDTH / 4.5;
		const highScoreY = CANVAS_HEIGHT / 4;
		const highScoreWidth = CANVAS_WIDTH - highScoreX * 2
		const highScoreHeight = CANVAS_HEIGHT - highScoreY *2;
        roundRect(context, highScoreX, highScoreY, highScoreWidth , highScoreHeight, 10).fill();

		context.fillStyle = 'black' //ColorScheme.White;
		context.fillText("High Score", CANVAS_WIDTH/2, highScoreY + 50);
		
		context.fillStyle =  'black'  //ColorScheme.White;
        context.font = "30px Joystix";
		for (let i = 0; i < HighScoreManager.MAX_HIGH_SCORES; i++) {
			const name = this.highScores[i].name ?? '---';
			const score = this.highScores[i].score ?? '---';

			context.textAlign = 'left';
			context.fillText(`${i + 1}.`, CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.4 + i * 45);
			context.textAlign = 'center';
			context.fillText(`${name}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.4 + i * 45);
			context.textAlign = 'right';
			context.fillText(`${score}`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.4 + i * 45);
		}



		context.fillStyle = ColorScheme.White;
		context.font = "20px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Enter to play again!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.85);
		context.restore();

	}
}
