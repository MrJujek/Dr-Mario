import { size } from "./Board";

interface PillClassInterface {
    pill: PillInterface;
    pillColors: string[];
    getPill(): PillInterface;
}

interface PillPositionInterface {
    x: number;
    y: number;
}

interface PillElementInterface {
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

export default class Pill implements PillClassInterface {
    pill: PillInterface;
    pillColors: string[];

    constructor() {
        console.log("Pill constructor");

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

    getPill() {
        console.log("Get pill");

        let firstPillElement = document.createElement("div");
        firstPillElement.id = "pill_first";
        firstPillElement.classList.add("pill");
        firstPillElement.style.top = `${this.pill.firstElement.position.y * size}px`;
        firstPillElement.style.left = `${this.pill.firstElement.position.x * size}px`;
        firstPillElement.style.backgroundImage = getImg(this.pill.firstElement.color, "left");

        let secondPillElement = document.createElement("div");
        secondPillElement.id = "pill_second";
        secondPillElement.classList.add("pill");
        secondPillElement.style.top = `${this.pill.secondElement.position.y * size}px`;
        secondPillElement.style.left = `${this.pill.secondElement.position.x * size}px`;
        secondPillElement.style.backgroundImage = getImg(this.pill.secondElement.color, "right");

        let board = document.getElementById("board") as HTMLElement;

        board.append(firstPillElement);
        board.append(secondPillElement);

        return this.pill;
    }
};

export function getImg(color: string, direction: string) {
    // console.log(`./img/pill/${color}_${direction}.png`);

    return `url(./img/pill/${color}_${direction}.png)`;
}