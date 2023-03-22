import Board from "./Board.js";
import Pill from "./Pill.js";

interface virusPosition {
    x: number;
    y: number;
}

interface viruses {
    color: string;
    position: virusPosition;
}

interface StepData {
    element: HTMLElement | undefined;
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
    constructor() {
        console.log("Game constructor");

        this.isPillOnBoard = false;
        this.board = new Board(8, 16).getBoard();
        this.viruses = [];
        this.level = 1;
        this.stepData = {
            element: undefined,
            start: undefined,
            previousTimeStamp: undefined,
            done: false
        }

        console.table(this.board);
    }

    start() {
        console.log("Game start");

        if (this.viruses.length <= 0) {
            this.generateViruses();
        }

        window.requestAnimationFrame(this.step.bind(this));
    }

    generateViruses() {
        console.log("Game generateViruses");

        for (let i = 0; i < (this.level + 2 > 10 ? 10 : this.level + 2); i++) {
            let virusX = Math.floor(Math.random() * 8);
            let virusY = Math.floor(Math.random() * 8) + 8;
            let virusColor = virusColors[Math.floor(Math.random() * virusColors.length)];

            while (this.board[virusY][virusX] != 0) {
                virusX = Math.floor(Math.random() * 7);
                virusY = Math.floor(Math.random() * 7) + 8;
            }

            this.board[virusY][virusX] = 1;

            this.viruses.push({
                color: virusColor,
                position: {
                    x: virusX,
                    y: virusY
                }
            });

            (document.getElementById(`square_${virusY}-${virusX}`) as HTMLElement).style.backgroundColor = virusColor;
        }
        console.log(this.viruses.length);
        console.log(this.viruses);
    }

    step(timestamp: number) {
        console.log("Game step");

        if (this.isPillOnBoard === false) {
            const pill = new Pill().getPill();
            console.log(pill.firstElement.position);

            this.isPillOnBoard = true;
        }

        if (this.stepData.start === undefined) {
            this.stepData.start = timestamp;
        }

        const elapsed = timestamp - this.stepData.start;

        if (this.stepData.previousTimeStamp !== timestamp) {
            // Math.min() is used here to make sure the element stops at exactly 200px
            const count = Math.min(0.1 * elapsed, 200);
            //this.stepData.element.style.transform = `translateX(${count}px)`;
            if (count === 200)
                this.stepData.done = true;
        }

        if (elapsed < 2000) {
            //console.log("elapsed: " + elapsed);

            // Stop the animation after 2 seconds
            this.stepData.previousTimeStamp = timestamp;
            if (!this.stepData.done) {
                window.requestAnimationFrame(this.step.bind(this));
            }
        }
    }
}