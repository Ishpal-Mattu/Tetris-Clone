import State from "../../lib/State.js"
import ColorScheme from "../enums/ColorScheme.js";
import GameStateName from "../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine } from "../globals.js";
import HighScoreManager from "../services/HighScoreManager.js";

/**
 * Represents the screen where we can view all high scores previously recorded.
 */
export default class HighScoreState extends State{
    constructor(){
        super();

    }

    enter(parameters) {
		this.highScores = HighScoreManager.loadHighScores();
	}

	update(dt) {
		// Return to the start screen if we press escape.
		if (keys.Escape) {
			keys.Escape = false;
			
            // TODO play sound representing going back

			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		context.globalAlpha = 0.8;
		images.render("blockBackground", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.globalAlpha = 1;

		context.save();
		context.fillStyle = ColorScheme.Purple;
		context.font = "48px MinecraftEvenings";
		context.textAlign = 'center';
		context.fillText(`🎉 HIGH SCORES 🎉`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);


        context.fillStyle = ColorScheme.White;
        context.font = "30px MinecraftEvenings";
		for (let i = 0; i < HighScoreManager.MAX_HIGH_SCORES; i++) {
			const name = this.highScores[i].name ?? '---';
			const score = this.highScores[i].score ?? '---';

			context.textAlign = 'left';
			context.fillText(`${i + 1}.`, CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.4 + i * 40);
			context.textAlign = 'center';
			context.fillText(`${name}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.4 + i * 40);
			context.textAlign = 'right';
			context.fillText(`${score}`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.4 + i * 40);
		}

		context.font = "20px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.restore();
	}
}