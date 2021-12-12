/**
 * Game Name
 *
 * Authors
 *
 * Brief description
 *
 * Asset sources
 * 
 * Images:
 * - Title-tile: <a href="https://www.vecteezy.com/free-vector/ornament">Ornament Vectors by Vecteezy</a>
 * - Gameover Text: <a href="https://www.vecteezy.com/free-vector/green">Green Vectors by Vecteezy</a>
 * 
 * Fonts:
 * - NewTetrisRegular font : https://fontsgeek.com/fonts/NEW-TETRIS-Regular
 * - Tetris2 font: https://www.fontspace.com/tetris-2-font-f11520 
 * 
 * Sounds:
 * - Most sounds: https://csanyk.itch.io/gmltetris
 * - High score: https://orangefreesounds.com/new-high-score-sound-effect/ 
 */



import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	context,
	fonts,
	images,
	keys,
	mute,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import HighScoreState from "./states/HighScoreState.js";
import InstructionsState from "./states/InstructionsState.js";
import EnterHighScoreState from "./states/EnterHighScoreState.js";
import SoundName from "./enums/SoundName.js";

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
	// @ts-ignore
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.Highscore, new HighScoreState());
stateMachine.add(GameStateName.Instructions, new InstructionsState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.EnterHighScore, new EnterHighScoreState());
stateMachine.add(GameStateName.Play, new PlayState());

stateMachine.change(GameStateName.TitleScreen);

function wasdToArrow(key){
	switch(key){
		case 'w': return 'ArrowUp';
		case 's': return 'ArrowDown';
		case 'a': return 'ArrowLeft';
		case 'd': return 'ArrowRight';
		default: return key;
	}
}

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	let key = wasdToArrow(event.key);
	if(key == 'm'){
		sounds.play(SoundName.Mute);
		sounds.toggleMute();
		sounds.play(SoundName.Mute);
		
		if(Game.mute)
			Game.mute = false;
			
		else
			Game.mute = true;
	}
	keys[key] = true;
});

canvas.addEventListener('keyup', event => {
	let key = wasdToArrow(event.key);
	keys[key] = false;
});

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
