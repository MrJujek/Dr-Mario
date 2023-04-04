import Game from "./Game.js";

let game: Game;

startGame();

function startGame() {
    game = new Game();
    game.start();
}

export { game };