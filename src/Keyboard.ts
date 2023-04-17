import { game } from "./main";

export default function startCheckingForInput() {
    window.addEventListener("keydown", (event) => {
        let pill = Array.from(document.querySelectorAll<HTMLElement>(".pill"));
        if (pill.length > 1) {
            if (event.key === "ArrowLeft") {
                keyLeft(pill);
            }
            if (event.key === "ArrowRight") {
                keyRight(pill);
            }
            if (event.key === "ArrowDown") {
                //keyDown(pill);
            }
            if (event.key === "ArrowUp") {
                //keyUp(pill);
            }
        } else {
            console.log("no pill");
        }
    });
}

function keyLeft(pill: HTMLElement[]) {
    console.log("left");

    let firstX = game.pill!.firstElement.position.x;
    let secondX = game.pill!.secondElement.position.x;
    let firstY = game.pill!.firstElement.position.y;
    let secondY = game.pill!.secondElement.position.y;

    console.table(game.board)
    console.log("firstX", firstX, "firstY", firstY);
    console.log("secondX", secondX, "secondY", secondY);

    //if (Math.min(firstX, secondX) >= 1 && game.board[Math.min(firstY, secondY) + 1][Math.min(firstX, secondX)] == 0 && game.board[Math.min(firstY, secondY)][Math.min(firstX, secondX)] == 0) {
    if (Math.min(firstX, secondX) >= 1) {
        pill.forEach((pill) => {
            console.log(pill);
            pill.style.left = (parseFloat(pill.style.left) - 50) + "px";

        });

        console.log("before", game.pill);

        game.pill!.firstElement.position.x--;
        game.pill!.secondElement.position.x--;

        console.log("after", game.pill);
    }
}

function keyRight(pill: HTMLElement[]) {
    console.log("left");

    let firstX = game.pill!.firstElement.position.x;
    let secondX = game.pill!.secondElement.position.x;
    let firstY = game.pill!.firstElement.position.y;
    let secondY = game.pill!.secondElement.position.y;

    if (Math.max(firstX, secondX) <= 6) {
        pill.forEach((pill) => {
            console.log(pill);
            pill.style.left = (parseFloat(pill.style.left) + 50) + "px";
        });

        console.log("before", game.pill);

        game.pill!.firstElement.position.x++;
        game.pill!.secondElement.position.x++;

        console.log("after", game.pill);
    }
}

// function keyDown(pill: HTMLElement[]) {
//     console.log("down");
// }

// function keyUp(pill: HTMLElement[]) {
//     console.log("up");
// }
