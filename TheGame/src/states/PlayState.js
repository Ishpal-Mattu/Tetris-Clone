import Game from "../../lib/Game.js";
import State from "../../lib/State.js";
import { GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, keys} from "../globals.js";
import GameBoard from "../objects/GameBoard.js";
import UserInterface from "../services/UserInterface.js";

export default class PlyState extends State {
	constructor() {
		super();
		this.gameBoard = new GameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
		this.userInterface = new UserInterface(this.gameBoard);
		console.log(this.gameBoard.grid);

		this.deltaTime = 0;
		//(x,y) => { list[4*y + x] }
	}

	enter(parameters){
		
	}

	update(dt){
		//Game.updateDelay = true;
		this.deltaTime += dt;
		if(this.deltaTime >= 2){
			this.deltaTime = 0;
			
		}

		this.gameBoard.update(dt);
		this.userInterface.update();
		

		
	}

	render(){
		this.userInterface.render();
		this.gameBoard.render();
	}

	exit(){
		Game.updateDelay = false;
	}
}
