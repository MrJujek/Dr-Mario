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
                keyDown();
            }
            if (event.code === "ArrowUp") {
                //keyUp();
            }
            if (event.code === "Space") {
                game.moveFastDown = true;
            }
        } else {
            console.log("no pill");
        }
    });

    window.addEventListener("keyup", (event) => {
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

function keyDown() {
    //console.log("down");

    let firstX = game.pill!.firstElement.position.x;
    let secondX = game.pill!.secondElement.position.x;
    let firstY = game.pill!.firstElement.position.y;
    let secondY = game.pill!.secondElement.position.y;

    let firstPill = (document.getElementById("pill_first") as HTMLElement);
    let secondPill = (document.getElementById("pill_second") as HTMLElement);

    if (firstY == secondY) {
        if (firstX < secondX) {
            //console.log("1 -> 2");

            if (firstY - 1 >= 0 && game.board[firstY - 1][firstX] == 0) {
                secondPill.style.top = (parseFloat(secondPill.style.top) - 50) + "px";
                secondPill.style.left = (parseFloat(secondPill.style.left) - 50) + "px";

                game.pill!.secondElement.position.x--;
                game.pill!.secondElement.position.y--;
            }
        } else {
            //console.log("3 -> 1");

            firstPill.style.left = (parseFloat(firstPill.style.left) - 50) + "px";
            secondPill.style.left = (parseFloat(secondPill.style.left) + 50) + "px";

            game.pill!.firstElement.position.x--;
            game.pill!.secondElement.position.x++;
        }
    } else {
        //console.log("2 -> 3");

        if (firstX + 1 <= 7 && game.board[firstY][firstX + 1] == 0) {
            firstPill.style.left = (parseFloat(firstPill.style.left) + 50) + "px";
            secondPill.style.top = (parseFloat(secondPill.style.top) + 50) + "px";

            game.pill!.firstElement.position.x++;
            game.pill!.secondElement.position.y++;
        }
    }
}

// function keyUp(pill: HTMLElement[]) {
//     console.log("up");
// }