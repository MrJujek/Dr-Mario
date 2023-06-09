import { size } from "./Board";
import { game } from "./main";

export interface PillClassInterface {
    pill: PillInterface;
    pillColors: string[];
    getPill(): PillInterface;
}

export interface PillPositionInterface {
    x: number;
    y: number;
}

export interface PillElementInterface {
    color: string;
    position: PillPositionInterface;
}

export interface PillInterface {
    firstElement: PillElementInterface;
    secondElement: PillElementInterface;
}

const pillColors = [
    "red",
    "blue",
    "yellow"
];

/**
 * Klasa reprezentujaca tabletki
 */
export default class Pill implements PillClassInterface {
    pill: PillInterface;
    pillColors: string[];

    constructor() {
        this.pillColors = []
        for (let i = 0; i < 2; i++) {
            this.pillColors.push(pillColors[Math.floor(Math.random() * pillColors.length)]);
        }

        this.pill = {
            firstElement: {
                color: this.pillColors[0],
                position: {
                    x: 3,
                    y: 0
                }
            },
            secondElement: {
                color: this.pillColors[1],
                position: {
                    x: 4,
                    y: 0
                }
            },
        }
    }

    /**
     * Funkcja tworzaca podglad tabletki
     */
    previewPill() {
        let firstPillElement = document.createElement("div");
        firstPillElement.id = "preview_first";
        firstPillElement.classList.add("preview_pill");
        firstPillElement.style.top = `${3 * size}px`;
        firstPillElement.style.left = `${31 * size}px`;
        firstPillElement.style.backgroundImage = getImg(this.pill.firstElement.color, "left");

        let secondPillElement = document.createElement("div");
        secondPillElement.id = "preview_second";
        secondPillElement.classList.add("preview_pill");
        secondPillElement.style.top = `${3 * size}px`;
        secondPillElement.style.left = `${32 * size}px`;
        secondPillElement.style.backgroundImage = getImg(this.pill.secondElement.color, "right");

        document.body.append(firstPillElement);
        document.body.append(secondPillElement);
    }

    /**
     * Funkcja losujaca kolory tabletki i ustawiajaca ja na planszy
     * @param color1 
     * @param color2 
     * @returns 
     */
    getPill(color1?: string, color2?: string) {
        let firstPillElement = document.createElement("div");
        firstPillElement.id = "pill_first";
        firstPillElement.classList.add("pill");
        firstPillElement.style.top = `${this.pill.firstElement.position.y * size}px`;
        firstPillElement.style.left = `${this.pill.firstElement.position.x * size}px`;

        if (color1) {
            firstPillElement.style.backgroundImage = getImg(color1, "left");
            this.pill.firstElement.color = color1;
        } else {
            firstPillElement.style.backgroundImage = getImg(this.pill.firstElement.color, "left");
        }

        let secondPillElement = document.createElement("div");
        secondPillElement.id = "pill_second";
        secondPillElement.classList.add("pill");
        secondPillElement.style.top = `${this.pill.secondElement.position.y * size}px`;
        secondPillElement.style.left = `${this.pill.secondElement.position.x * size}px`;

        if (color2) {
            secondPillElement.style.backgroundImage = getImg(color2, "right");
            this.pill.secondElement.color = color2;
        } else {
            secondPillElement.style.backgroundImage = getImg(this.pill.secondElement.color, "right");
        }

        let board = document.getElementById("board") as HTMLElement;

        board.append(firstPillElement);
        board.append(secondPillElement);

        return this.pill;
    }

    /**
     * Funkcja animujaca ruch tabletki do butelki
     */
    movePreview() {
        let frame = 0;
        let animation = setInterval(() => {
            if (game.board[0][3] != 0 || game.board[0][4] != 0) {
                game.isGameOver = true;
                clearInterval(animation)

                document.querySelectorAll(".preview_pill").forEach((element) => {
                    element.remove();
                });
            }

            if (game.isGameOver || game.isStageCompleted) {
                clearInterval(animation)

                document.querySelectorAll(".preview_pill").forEach((element) => {
                    element.remove();
                });
                return
            };

            if (frame == 0) {
                (document.getElementById("doctor") as HTMLElement).style.backgroundImage = "url('../img/doctor/doctor_throw.png')";
            }
            if (frame == 19) {
                (document.getElementById("doctor") as HTMLElement).style.backgroundImage = "url('../img/doctor/doctor_keep.png')";
            }

            let firstPillElement = document.getElementById("preview_first") as HTMLElement;
            let secondPillElement = document.getElementById("preview_second") as HTMLElement;

            firstPillElement.style.top = `${pillAnimation[frame][0] * size}px`;
            firstPillElement.style.left = `${pillAnimation[frame][1] * size}px`;
            secondPillElement.style.top = `${pillAnimation[frame][0] * size}px`;
            secondPillElement.style.left = `${(pillAnimation[frame][1] + 1) * size}px`;

            frame++;
        }, 50);

        setTimeout(() => {
            clearInterval(animation);
        }, 1000);

    }
};

/**
 * Funkcja zwracajaca url do grafiki dla tabletki
 * @param color 
 * @param direction 
 * @returns css url do grafiki
 */
export function getImg(color: string, direction: string) {
    return `url(./img/pill/${color}_${direction}.png)`;
}

// length 20
const pillAnimation = [
    [3, 31],
    [3, 30],
    [2, 30],
    [2, 29],
    [2, 28],
    [1, 28],
    [1, 27],
    [1, 26],
    [1, 25],
    [0, 24],
    [0, 23],
    [0, 22],
    [0, 21],
    [1, 21],
    [1, 20],
    [2, 20],
    [3, 20],
    [4, 20],
    [5, 20],
    [6, 20]
];