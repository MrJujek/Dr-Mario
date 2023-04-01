import Board from "./Board.js";
import Pill, { PillInterface } from "./Pill.js";

interface virusPosition {
    x: number;
    y: number;
}

interface viruses {
    color: string;
    position: virusPosition;
}

interface StepData {
    start: number | undefined;
    previousTimeStamp: number | undefined;
    done: boolean;
}

const virusColors = [
    "red",
    "blue",
    "yellow"
];

export default class Game {
    level: number;
    board: number[][];
    viruses: viruses[];
    stepData: StepData;
    isPillOnBoard: boolean;
    pill: PillInterface | null

    constructor() {
        console.log("Game constructor");

        this.isPillOnBoard = false;
        this.board = new Board(8, 16).getBoard();
        this.viruses = [];
        this.level = 1;
        this.stepData = {
            start: undefined,
            previousTimeStamp: undefined,
            done: false
        }
        this.pill = null
    }

    start() {
        console.log("Game start");

        if (this.viruses.length <= 0) {
            this.generateViruses();
        }

        window.requestAnimationFrame(this.step);
    }

    generateViruses() {
        console.log("Game generateViruses");

        for (let i = 0; i < (this.level + 2 > 10 ? 12 : this.level + 2); i++) {
            let virusX = Math.floor(Math.random() * 8);
            let virusY = Math.floor(Math.random() * 8) + 8;
            let virusColor = virusColors[Math.floor(Math.random() * virusColors.length)];

            while (this.board[virusY][virusX] != 0) {
                virusX = Math.floor(Math.random() * 7);
                virusY = Math.floor(Math.random() * 7) + 8;
            }

            switch (virusColor) {
                case "red":
                    this.board[virusY][virusX] = 2;
                    break;
                case "blue":
                    this.board[virusY][virusX] = 3;
                    break;
                case "yellow":
                    this.board[virusY][virusX] = 4;
                    break;
                default:
                    this.board[virusY][virusX] = 0;
                    break;
            }

            this.viruses.push({
                color: virusColor,
                position: {
                    x: virusX,
                    y: virusY
                }
            });

            (document.getElementById(`square_${virusY}-${virusX}`) as HTMLElement).style.backgroundColor = virusColor;
        }
        //console.log(this.viruses.length);
        //console.log(this.viruses);
    }

    step = (timestamp: number) => {
        //console.log("Game step");

        if (this.isPillOnBoard === false) {
            this.pill = new Pill().getPill();
            this.isPillOnBoard = true;
            this.stepData.done = false

            console.log(this.pill!.firstElement.position.y);
        }

        if (this.stepData.start === undefined) {
            this.stepData.start = timestamp;
        }

        let firstElement = document.getElementById("pill_first") as HTMLElement;
        let secondElement = document.getElementById("pill_second") as HTMLElement;

        const elapsed = timestamp - this.stepData.start;
        //console.log("elapsed: " + elapsed);

        if (this.stepData.previousTimeStamp !== timestamp) {
            // Math.min() is used here to make sure the element stops at exactly 200px
            const count = Math.min(Math.round(0.05 * elapsed * 10) / 10, 50); //Math.round(0.05 * elapsed * 10) / 10
            firstElement.style.transform = `translateY(${count}px)`;
            secondElement.style.transform = `translateY(${count}px)`;
        }

        if (elapsed > 1000) {
            //console.log("second has passed");
            this.updateAfterSecond(firstElement, secondElement);

            this.stepData.previousTimeStamp = timestamp;
            this.stepData.start = this.stepData.previousTimeStamp;
        }

        if (this.stepData.done == true) {
            this.isPillOnBoard = false;

            console.log(this.pill!.firstElement.color);

            switch (this.pill!.firstElement.color) {
                case "red":
                    this.board[this.pill!.firstElement.position.y][this.pill!.firstElement.position.x] = 2;
                    break;
                case "blue":
                    this.board[this.pill!.firstElement.position.y][this.pill!.firstElement.position.x] = 3;
                    break;
                case "yellow":
                    this.board[this.pill!.firstElement.position.y][this.pill!.firstElement.position.x] = 4;
                    break;
                default:
                    this.board[this.pill!.firstElement.position.y][this.pill!.firstElement.position.x] = 0;
                    break;
            }

            switch (this.pill!.secondElement.color) {
                case "red":
                    this.board[this.pill!.secondElement.position.y][this.pill!.secondElement.position.x] = 2;
                    break;
                case "blue":
                    this.board[this.pill!.secondElement.position.y][this.pill!.secondElement.position.x] = 3;
                    break;
                case "yellow":
                    this.board[this.pill!.secondElement.position.y][this.pill!.secondElement.position.x] = 4;
                    break;
                default:
                    this.board[this.pill!.secondElement.position.y][this.pill!.secondElement.position.x] = 0;
                    break;
            }

            (document.getElementById(`square_${this.pill!.firstElement.position.y}-${this.pill!.firstElement.position.x}`) as HTMLElement).style.backgroundColor = this.pill!.firstElement.color;
            (document.getElementById(`square_${this.pill!.secondElement.position.y}-${this.pill!.secondElement.position.x}`) as HTMLElement).style.backgroundColor = this.pill!.secondElement.color;

            firstElement.remove();
            secondElement.remove();

            this.pill = null;

            console.table(this.board);
        }

        window.requestAnimationFrame(this.step);
    }

    updateAfterSecond = (firstElement: HTMLElement, secondElement: HTMLElement) => {
        this.pill!.firstElement.position.y++;
        this.pill!.secondElement.position.y++;

        console.log("this.pill!.firstElement.position.y", this.pill!.firstElement.position.y);
        console.log("this.pill!.secondElement.position.y", this.pill!.secondElement.position.y);

        if (this.pill!.firstElement.position.y >= 15 || this.pill!.secondElement.position.y >= 15) {
            console.log("end of board");
            this.stepData.done = true;
        } else {
            if (this.board[this.pill!.firstElement.position.y + 1][this.pill!.firstElement.position.x] != 0 || this.board[this.pill!.secondElement.position.y + 1][this.pill!.secondElement.position.x] != 0) {
                console.log("something is under");
                this.stepData.done = true;
            }
        }

        firstElement.style.top = `${parseFloat(firstElement.style.top) + 50}px`;
        secondElement.style.top = `${parseFloat(secondElement.style.top) + 50}px`;
        firstElement.style.transform = `translateY(0px)`;
        secondElement.style.transform = `translateY(0px)`;
    }
}


/*
math min pill y
pill y
*/