import Game from "./Game";

let game: Game;

startGame();

function startGame() {
    game = new Game();
    game.start();
}

export { game };