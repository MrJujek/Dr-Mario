import Game from "./Game";
import "../scss/main.scss";

let game: Game;

let interval = setInterval(() => {
    if ((document.getElementById("doctor") as HTMLElement).style.backgroundImage == 'url("../img/doctor/doctor_2.png")') {
        (document.getElementById("doctor") as HTMLElement).style.backgroundImage = "url(../img/doctor/doctor_1.png)";
    } else {
        (document.getElementById("doctor") as HTMLElement).style.backgroundImage = "url(../img/doctor/doctor_2.png)";
    }
}, 800);

(document.getElementById("start") as HTMLElement).onmousedown = () => {
    (document.getElementById("start") as HTMLElement).style.backgroundImage = "url(../img/start_pressed.png)";
}

document.body.onmouseup = () => {
    (document.getElementById("start") as HTMLElement).style.backgroundImage = "url(../img/start.png)";
}

(document.getElementById("start") as HTMLElement).onmouseup = () => {
    clearInterval(interval);
    startGame();

    (document.getElementById("start") as HTMLElement).remove();
}

function startGame() {
    game = new Game();
    game.start();
}

export { game };