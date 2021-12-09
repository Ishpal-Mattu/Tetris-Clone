import Game from "../../lib/Game.js";
import State from "../../lib/State.js";
import { GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH} from "../globals.js";
import GameBoard from "../objects/GameBoard.js";
import UserInterface from "../services/UserInterface.js";

export default class PlyState extends State {
	constructor() {
		super();
		this.gameBoard = new GameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
		this.userInterface = new UserInterface(this.gameBoard);
		console.log(this.gameBoard.grid);

		//(x,y) => { list[4*y + x] }
	}

	enter(parameters){
		Game.updateDelay = true;
	}

	update(dt){
		this.gameBoard.update(dt);
	}

	render(){
		this.userInterface.render();
		this.gameBoard.render();
	}

	exit(){
		Game.updateDelay = false;
	}
}
