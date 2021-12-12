import { roundRect, textWrap } from "../../lib/CanvasHelper.js";
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

        context.fillStyle = ColorScheme.Red   //'#5098c4';
		const highScoreX = CANVAS_WIDTH / 7;
		const highScoreY = CANVAS_HEIGHT / 4;
		const highScoreWidth = CANVAS_WIDTH - highScoreX * 2
		const highScoreHeight = CANVAS_HEIGHT - highScoreY *2;
        roundRect(context, highScoreX, highScoreY, highScoreWidth , highScoreHeight, 10).fill();


		context.fillStyle = ColorScheme.Red;
		context.font = "50px Joystix";
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

        context.font = "13px Joystix";
        context.fillStyle = 'white';


        // Writing paragraph under each header
        let paragraphText = [
            "Use left and right arrow keys to move falling blocks. The A/D keys can also be used",
            "Use up arrow key to rotate the falling blocks. The W key can also be used",
            "Use the down arrow or 'S' key to speed drop the falling blocks. Using spacebar will instant drop the block in place"
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

        textXFraction = 0.5;
        context.font = "40px Joystix";
        context.fillStyle = ColorScheme.Yellow;
        context.fillText("Tips💡", CANVAS_WIDTH * textXFraction, CANVAS_HEIGHT * 0.6);
        
        context.font = "13px Joystix";
        context.fillStyle = ColorScheme.White;

        paragraphText = [
            "- Take a look at the next tetromino to strategically place each tetromino.",
            "- Put a tetromino on hold by clicking 'C'."
        ]

        context.textAlign = "left";
        heightOffset = 0;
        let xOffSet = 0;
        for(let i = 0; i < paragraphText.length; i++){
            xOffSet = 0;
            textArray = textWrap(context, paragraphText[i], highScoreWidth * 0.8);

            textArray.forEach(line => {
                context.fillText(line, CANVAS_WIDTH * 0.2 + xOffSet, CANVAS_HEIGHT * 0.65 + heightOffset)
                heightOffset += 15;
                xOffSet = 13;
            })

            heightOffset += 10;

        }


        // Instruction for navigation to title/menu screen
        context.fillStyle = ColorScheme.White;
		context.font = "20px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.85);
		context.restore();
	}

}