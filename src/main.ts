import Game from "./Game";
import "../scss/main.scss";

let game: Game;

/**
 * @description This interval is used to animate the doctor
 * @type {number}
 * @default
 */
export let interval = setInterval(() => {
    if ((document.getElementById("doctor") as HTMLElement).style.backgroundImage == 'url("../img/doctor/doctor_2.png")') {
        (document.getElementById("doctor") as HTMLElement).style.backgroundImage = "url(../img/doctor/doctor_1.png)";
    } else {
        (document.getElementById("doctor") as HTMLElement).style.backgroundImage = "url(../img/doctor/doctor_2.png)";
    }
}, 800);

/**
 * @description This event is used to animate the start button
 * @type {HTMLElement}
 * @default
 */
(document.getElementById("start") as HTMLElement).onmousedown = () => {
    (document.getElementById("start") as HTMLElement).style.backgroundImage = "url(../img/start_pressed.png)";
}

/**
 * @description This event is used to animate the start button
 * @returns {void}
 */
document.body.onmouseup = () => {
    if (!document.getElementById("start")) return;
    (document.getElementById("start") as HTMLElement).style.backgroundImage = "url(../img/start.png)";
}

/**
 * @description This event is used to start the game
 */
(document.getElementById("start") as HTMLElement).onmouseup = () => {
    clearInterval(interval);
    startGame();

    (document.getElementById("start") as HTMLElement).remove();
}

/**
 * @description This function is used to start the game
 * @returns {void}
 */
export function startGame() {
    game = new Game();
    game.start();
}

export { game };