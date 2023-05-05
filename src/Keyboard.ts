import { game } from "./main";

export default function startCheckingForInput() {
    window.addEventListener("keydown", (event) => {
        let pill = Array.from(document.querySelectorAll<HTMLElement>(".pill"));
        if (pill.length > 1) {
            if (event.code === "ArrowLeft") {
                keyLeft(pill);
            }
            if (event.code === "ArrowRight") {
                keyRight(pill);
            }
            if (event.code === "ArrowDown") {
                //keyDown(pill);
            }
            if (event.code === "ArrowUp") {
                //keyUp(pill);
            }
            if (event.code === "Space") {
                game.moveFastDown = true;
            }
        } else {
            console.log("no pill");
        }
    });

    window.addEventListener("keyup", (event) => {
        console.log(event);

        if (event.code === "Space") {
            game.moveFastDown = false;
        }
    });
}

function keyLeft(pill: HTMLElement[]) {
    //console.log("left");

    let firstX = game.pill!.firstElement.position.x;
    let secondX = game.pill!.secondElement.position.x;
    let firstY = game.pill!.firstElement.position.y;
    let secondY = game.pill!.secondElement.position.y;

    //game.board[y][x]
    if (Math.min(firstX, secondX) >= 1 && game.board[firstY][Math.min(firstX, secondX) - 1] == 0 && game.board[secondY][Math.min(firstX, secondX) - 1] == 0) {
        pill.forEach((pill) => {
            pill.style.left = (parseFloat(pill.style.left) - 50) + "px";
        });

        game.pill!.firstElement.position.x--;
        game.pill!.secondElement.position.x--;
    }
}

function keyRight(pill: HTMLElement[]) {
    //console.log("right");

    let firstX = game.pill!.firstElement.position.x;
    let secondX = game.pill!.secondElement.position.x;
    let firstY = game.pill!.firstElement.position.y;
    let secondY = game.pill!.secondElement.position.y;

    if (Math.max(firstX, secondX) <= 6 && game.board[firstY][Math.max(firstX, secondX) + 1] == 0 && game.board[secondY][Math.max(firstX, secondX) + 1] == 0) {
        pill.forEach((pill) => {
            pill.style.left = (parseFloat(pill.style.left) + 50) + "px";
        });

        game.pill!.firstElement.position.x++;
        game.pill!.secondElement.position.x++;
    }
}

// function keyDown(pill: HTMLElement[]) {
//     console.log("down");
// }

// function keyUp(pill: HTMLElement[]) {
//     console.log("up");
// }