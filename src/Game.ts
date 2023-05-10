import Board from "./Board";
import Pill, { PillInterface } from "./Pill";
import startCheckingForInput from "./Keyboard";

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

interface ToDeleteInterface {
    row: number;
    column: number;
}

interface ColumnsToMoveInterface {
    column: number;
    start: number;
    end: number;
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
    pill: PillInterface | null;
    moveFastDown: boolean;
    toDelete: ToDeleteInterface[];
    animateDeletion: boolean;
    countOfBlocksToFall: number;
    countOfFallenBlocks: number;

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
        this.pill = null;
        this.moveFastDown = false;
        this.toDelete = [];
        this.animateDeletion = false;
        this.countOfBlocksToFall = 0;
        this.countOfFallenBlocks = 0;
    }

    start() {
        console.log("Game start");

        startCheckingForInput();

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
                    this.board[virusY][virusX] = 2 + 3;
                    break;
                case "blue":
                    this.board[virusY][virusX] = 3 + 3;
                    break;
                case "yellow":
                    this.board[virusY][virusX] = 4 + 3;
                    break;
            }

            this.viruses.push({
                color: virusColor,
                position: {
                    x: virusX,
                    y: virusY
                }
            });

            // (document.getElementById(`square_${virusY}-${virusX}`) as HTMLElement).style.backgroundColor = virusColor;
            (document.getElementById(`square_${virusY}-${virusX}`) as HTMLElement).style.backgroundImage = `url(./img/virus/covid_${virusColor}.png)`;
        }
    }

    step = (timestamp: number) => {
        //console.log("Game step");

        if (this.isPillOnBoard === false) {
            this.pill = new Pill().getPill();
            this.isPillOnBoard = true;
            this.stepData.done = false
        }

        if (this.stepData.start === undefined) {
            this.stepData.start = timestamp;
        }

        let firstElement = document.getElementById("pill_first") as HTMLElement;
        let secondElement = document.getElementById("pill_second") as HTMLElement;

        const elapsed = timestamp - this.stepData.start;

        if (this.animateDeletion == false) {
            if (this.moveFastDown) {
                if (elapsed > 100) {
                    this.updateAfterSecond(firstElement, secondElement);

                    this.stepData.previousTimeStamp = timestamp;
                    this.stepData.start = this.stepData.previousTimeStamp;
                }
            } else {
                if (elapsed > 1000) {
                    this.updateAfterSecond(firstElement, secondElement);

                    this.stepData.previousTimeStamp = timestamp;
                    this.stepData.start = this.stepData.previousTimeStamp;
                }
            }
        }

        if (this.stepData.done == true) {
            this.isPillOnBoard = false;

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

            // (document.getElementById(`square_${this.pill!.firstElement.position.y}-${this.pill!.firstElement.position.x}`) as HTMLElement).style.backgroundColor = this.pill!.firstElement.color;
            // (document.getElementById(`square_${this.pill!.secondElement.position.y}-${this.pill!.secondElement.position.x}`) as HTMLElement).style.backgroundColor = this.pill!.secondElement.color;

            (document.getElementById(`square_${this.pill!.firstElement.position.y}-${this.pill!.firstElement.position.x}`) as HTMLElement).style.backgroundImage = firstElement.style.backgroundImage;
            (document.getElementById(`square_${this.pill!.secondElement.position.y}-${this.pill!.secondElement.position.x}`) as HTMLElement).style.backgroundImage = secondElement.style.backgroundImage;

            firstElement.remove();
            secondElement.remove();

            this.checkForDelete();

            this.pill = null;
        }

        window.requestAnimationFrame(this.step);
    }

    /**
     * @param firstElement
     * @param secondElement
     * 
     * check if something is under or end of board
     */
    updateAfterSecond = (firstElement: HTMLElement, secondElement: HTMLElement) => {
        // check if something is under
        if (this.pill!.firstElement.position.y >= 15 || this.pill!.secondElement.position.y >= 15) {
            console.log("end of board");
            this.stepData.done = true;

        } else if (this.board[this.pill!.firstElement.position.y + 1][this.pill!.firstElement.position.x] != 0 || this.board[this.pill!.secondElement.position.y + 1][this.pill!.secondElement.position.x] != 0) {
            console.log("something is under");
            this.stepData.done = true;

        } else {
            this.pill!.firstElement.position.y++;
            this.pill!.secondElement.position.y++;

            firstElement.style.top = `${parseFloat(firstElement.style.top) + 50}px`;
            secondElement.style.top = `${parseFloat(secondElement.style.top) + 50}px`;
            firstElement.style.transform = `translateY(0px)`;
            secondElement.style.transform = `translateY(0px)`;
        }
    };

    checkForDelete = () => {
        this.toDelete = [];
        for (let row = 0; row <= 15; row++) {
            for (let cell = 0; cell <= 4; cell++) {
                let color = this.board[row][cell];
                let count = 0;

                if (color != 0) {
                    for (let i = cell + 1; i <= 7; i++) {
                        if (this.board[row][i] == color || this.board[row][i] == color + 3) {
                            count++;
                        } else {
                            break;
                        }
                    }

                    if (count >= 3) {
                        for (let i = cell; i <= cell + count; i++) {
                            this.toDelete.push({ row: row, column: i });
                        }
                    }
                }
            }
        }

        for (let column = 0; column <= 7; column++) {
            for (let row = 0; row <= 12; row++) {
                let color = this.board[row][column];
                let count = 0;

                if (color != 0) {
                    for (let i = row + 1; i <= 15; i++) {
                        if (this.board[i][column] == color || this.board[i][column] == color + 3) {
                            count++;
                        } else {
                            break;
                        }
                    }

                    if (count >= 3) {
                        for (let i = row; i <= row + count; i++) {
                            this.toDelete.push({ row: i, column: column });
                        }
                    }
                }
            }
        }

        if (this.toDelete.length > 0) {
            this.deleteAnimation();
        }
    }

    deleteAnimation = () => {
        this.animateDeletion = true;

        for (let i = 0; i < this.toDelete.length; i++) {
            let color = this.board[this.toDelete[i].row][this.toDelete[i].column];
            let square = document.getElementById(`square_${this.toDelete[i].row}-${this.toDelete[i].column}`) as HTMLElement;

            switch (color) {
                case 2:
                    square.style.backgroundImage = "url('/img/delete/red_delete.png')";
                    break;
                case 3:
                    square.style.backgroundImage = "url('/img/delete/blue_delete.png')";
                    break;
                case 4:
                    square.style.backgroundImage = "url('/img/delete/yellow_delete.png')";
                    break;
                case 5:
                    square.style.backgroundImage = "url('/img/delete/red_virus_delete.png')";
                    break;
                case 6:
                    square.style.backgroundImage = "url('/img/delete/blue_virus_delete.png')";
                    break;
                case 7:
                    square.style.backgroundImage = "url('/img/delete/yellow_virus_delete.png')";
                    break;
            }

            this.board[this.toDelete[i].row][this.toDelete[i].column] = 0;

            setTimeout(() => {
                square.style.backgroundImage = "url('')";
                square.style.backgroundColor = "black";
            }, 500);
        }

        let columnsToMove: ColumnsToMoveInterface[] = [];
        let columnsArray: number[] = [];

        for (let i = 0; i < this.toDelete.length; i++) {
            if (!columnsArray.includes(this.toDelete[i].column)) {
                columnsArray.push(this.toDelete[i].column);
            }
        }

        for (let i = 0; i < columnsArray.length; i++) {
            let start = -1;
            let end = -1;

            for (let j = 0; j < this.toDelete.length; j++) {
                if (this.toDelete[j].column == columnsArray[i]) {
                    if (start == -1 && end == -1) {
                        start = this.toDelete[j].row;
                        end = this.toDelete[j].row;
                    } else {
                        if (start > this.toDelete[j].row) {
                            start = this.toDelete[j].row;
                        }
                        if (end < this.toDelete[j].row) {
                            end = this.toDelete[j].row;
                        }
                    }
                }
            }

            columnsToMove.push({ column: columnsArray[i], start: start, end: end });
        }

        console.log(columnsToMove);

        this.countOfBlocksToFall = 0;
        this.countOfFallenBlocks = 0;
        for (let i = 0; i < columnsToMove.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[j][columnsToMove[i].column] != 0 && j < columnsToMove[i].start) {
                    let colorNumber = this.board[j][columnsToMove[i].column];
                    let color = (document.getElementById(`square_${j}-${columnsToMove[i].column}`) as HTMLElement).style.backgroundColor;

                    this.countOfBlocksToFall++;

                    let y = j;
                    setTimeout(() => {
                        let moveDown = setInterval(() => {
                            let square = document.getElementById(`square_${y}-${columnsToMove[i].column}`) as HTMLElement;
                            (document.getElementById(`square_${y - 1}-${columnsToMove[i].column}`) as HTMLElement).style.backgroundColor = "white";
                            square.style.backgroundColor = color;

                            this.board[y][columnsToMove[i].column] = 0;
                            y++;
                            if (y > columnsToMove[i].end || y > 15 || this.board[y][columnsToMove[i].column] != 0) {
                                this.countOfFallenBlocks++;
                                clearInterval(moveDown);

                                // if (this.countOfFallenBlocks >= this.countOfBlocksToFall) {
                                //     this.animateDeletion = false;
                                // }
                            }
                            this.board[y][columnsToMove[i].column] = colorNumber;
                        }, 100);
                    }, 500);
                }
            }
        }

        this.animateDeletion = false;
    }
}