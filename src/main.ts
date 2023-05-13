import Game from "./Game";
import "../scss/main.scss";

let game: Game;

startGame();

function startGame() {
    game = new Game();
    game.start();
}

export { game };