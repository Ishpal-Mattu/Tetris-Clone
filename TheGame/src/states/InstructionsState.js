import { textWrap } from "../../lib/CanvasHelper.js";
import State from "../../lib/State.js";
import ColorScheme from "../enums/ColorScheme.js";
import GameStateName from "../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, stateMachine } from "../globals.js";

export default class InstructionsState extends State {
    constructor(){
        super();
    }

    enter(parameters) {
		
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
		context.fillText(`How To Play`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);

        context.font = "40px Joystix";

        // Write instruction headers

        // MOVE
        context.fillStyle = ColorScheme.Green;
		context.fillText("Move", CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.3)
       
        // ROTATE
        context.fillStyle = ColorScheme.Blue;
		context.fillText("Rotate", CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.3)

        // DROP
        context.fillStyle = ColorScheme.Orange;
		context.fillText("Drop", CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.3)

        context.font = "20px Tank";
        context.fillStyle = ColorScheme.White;

        // Move Text



        let paragraphText = [
            "Use left and right arrow keys to move falling blocks. The a/d keys can also be used",
            "Use up arrow key to rotate the falling blocks. The w key can also be used",
            "Use the down arrow or 's' key to speed drop the falling blocks. Using spacebar will instant drop the block in place"
        ];
        let textArray;
        let heightOffset;
        let textXFraction = 0.25;
        for(let i = 0; i<paragraphText.length; i++){
            textArray = textWrap(context, paragraphText[i], 130);
            heightOffset = 0;

            textArray.forEach(line => {
                context.fillText(line, CANVAS_WIDTH * textXFraction, CANVAS_HEIGHT * 0.34 + heightOffset);
                heightOffset += 20;
            });

            textXFraction += 0.25;
        }
        
        context.fillStyle = ColorScheme.White;
		context.font = "20px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.restore();
	}

}