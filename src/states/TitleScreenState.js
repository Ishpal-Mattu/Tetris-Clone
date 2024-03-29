import State from "../../lib/State.js";
import ColorScheme from "../enums/ColorScheme.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine } from "../globals.js";

export default class TitleScreenState extends State {
	constructor() {
		super();

		this.menuOptions = {
			start: 'Start',
			highScores: 'High Scores',
			instructions: 'How To Play',
		};

		// The menu option we are higlighting
		this.highlighted = this.menuOptions.start;
	}

	enter(parameters) { 
		this.highlighted = this.menuOptions.start;
		this.toggleBackgroundSounds();
	}

	exit() { 
		
	}

	update(dt) { 
		
		this.toggleBackgroundSounds();
		
		// Toggle highlighted option if we press w or s.
		if(keys.ArrowUp){
			keys.ArrowUp = false;
			this.highlighted = this.highlighted === this.menuOptions.instructions ? this.menuOptions.highScores : this.highlighted === this.menuOptions.highScores ? this.menuOptions.start : this.menuOptions.instructions;
			
			sounds.stop(SoundName.Select)
			sounds.play(SoundName.Select);
			
		}
		else if(keys.ArrowDown){
			keys.ArrowDown = false;
			this.highlighted = this.highlighted === this.menuOptions.instructions ? this.menuOptions.start : this.highlighted === this.menuOptions.start ? this.menuOptions.highScores : this.menuOptions.instructions;
			
			sounds.stop(SoundName.Select)
			sounds.play(SoundName.Select);
			
		}

		// Confirm whichever option we have selected to change screens.
		if (keys.Enter) {
			keys.Enter = false;

			sounds.stop(SoundName.Confirm);
			sounds.play(SoundName.Confirm);
			

			if (this.highlighted === this.menuOptions.start) {
				sounds.pause(SoundName.MenuBackground);
				stateMachine.change(GameStateName.Play);
			}
			else if(this.highlighted === this.menuOptions.highScores){
				stateMachine.change(GameStateName.Highscore);
			}
			else{
				stateMachine.change(GameStateName.Instructions);
			}
		}
	}

	render() { 
		context.globalAlpha = 0.8;
		images.render("blockBackground", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.globalAlpha = 1;

		context.save();
		context.font = "125px TetrisBlocks2";
		context.textBaseline = 'middle';

		// Array for each letter's color
		const TITLE_FILL = [
			ColorScheme.Red, 		// Red
			ColorScheme.Orange,		// Orange
			ColorScheme.Yellow,		// Yellow
			ColorScheme.Green,		// Green
			ColorScheme.Blue,		// Blue
			ColorScheme.Purple, 	// Purple
		]
		
		const TITLE_STRING = "tetris";
		const TITLE_STRING_WIDTH = context.measureText(TITLE_STRING).width;
		const TITLE_ARRAY = "tetris".split('');

		// The starting x and y cordinate for writing title text
		const titleY = CANVAS_HEIGHT * 0.30;
		let titleX = (CANVAS_WIDTH * 0.5) - (TITLE_STRING_WIDTH * 0.5);

		// Color each letter differently
		for(let i = 0; i<TITLE_ARRAY.length; i++){
			context.fillStyle = TITLE_FILL[i % TITLE_FILL.length];
			context.fillText(TITLE_ARRAY[i], titleX, titleY );
			titleX += context.measureText(TITLE_ARRAY[i]).width;
		}

		context.textAlign = 'center';
		context.font = "30px MinecraftEvenings";

		// Set the fill style based on which option is highlighted.
		context.fillStyle = this.highlighted === this.menuOptions.start ? "cornflowerblue" : "white";
		context.fillText(`${this.menuOptions.start}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.75);
		context.fillStyle = this.highlighted === this.menuOptions.highScores ? "cornflowerblue" : "white";
		context.fillText(`${this.menuOptions.highScores}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.82);
		context.fillStyle = this.highlighted === this.menuOptions.instructions ? "cornflowerblue" : "white"
		context.fillText(`${this.menuOptions.instructions}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.89);

		context.restore();
	}

	toggleBackgroundSounds(){
		if(sounds.mute)
			sounds.pause(SoundName.MenuBackground);
		else
			sounds.play(SoundName.MenuBackground);
	}
}
