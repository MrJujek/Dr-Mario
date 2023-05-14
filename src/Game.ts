import Board from "./Board";
import Pill, { PillInterface, getImg } from "./Pill";
import startCheckingForInput from "./Keyboard";
import { size } from "./Board";
import Storage from "./Storage";

export interface virusPosition {
    x: number;
    y: number;
}

export interface viruses {
    color: string;
    position: virusPosition;
}

export interface StepData {
    start: number | undefined;
    previousTimeStamp: number | undefined;
    done: boolean;
}

export interface ToDeleteInterface {
    row: number;
    column: number;
}

export interface pillsPositions {
    firstX: number | null;
    firstY: number | null;
    secondX: number | null;
    secondY: number | null;
}

const virusColors = [
    "red",
    "blue",
    "yellow"
];

/**
 * Główna klasa gry
 * @class Game
 */
export default class Game {
    level: number;
    board: number[][];
    viruses: viruses[];
    stepData: StepData;
    isPillOnBoard: boolean;
    pill: PillInterface | null;
    moveFastDown: boolean;
    toDelete: ToDeleteInterface[];
    stopAnimation: boolean;
    countOfBlocksToFall: number;
    countOfFallenBlocks: number;
    pillsOnBoard: pillsPositions[];
    redRadius: number;
    blueRadius: number;
    yellowRadius: number;
    score: number;
    storage: Storage;
    nextColor1: string | undefined;
    nextColor2: string | undefined;
    isGameOver: boolean;
    isStageCompleted: boolean;
    animateThrow: boolean;

    constructor() {
        this.isPillOnBoard = false;
        this.board = new Board(8, 16).getBoard();
        this.viruses = [];

        this.level = 4

        this.stepData = {
            start: undefined,
            previousTimeStamp: undefined,
            done: false
        }
        this.pill = null;
        this.moveFastDown = false;
        this.toDelete = [];
        this.stopAnimation = false;
        this.countOfBlocksToFall = 0;
        this.countOfFallenBlocks = 0;
        this.pillsOnBoard = [];
        this.redRadius = 100;
        this.blueRadius = 180;
        this.yellowRadius = 240;
        this.score = 0;
        this.storage = new Storage();
        this.nextColor1 = undefined;
        this.nextColor2 = undefined;
        this.isGameOver = false;
        this.isStageCompleted = false;
        this.animateThrow = false;
    }

    /**
     * Startuje grę
     * @memberof Game
     * @method start
     * @returns {void}
     * @example
     * Game.start();
     */
    start = () => {
        startCheckingForInput();

        if (this.viruses.length <= 0) {
            this.generateViruses();
        }

        this.storage.loadHighScore();
        this.storage.updateScore(this.score);

        window.requestAnimationFrame(this.step);
    }

    /**
     * Generuje wirusy
     * 
     * @memberof Game
     * @method generateViruses
     * @returns {void}
     */
    generateViruses = () => {
        for (let i = 0; i < (this.level + 2 > 30 ? 30 : this.level + 2); i++) {
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

            (document.getElementById(`square_${virusY}-${virusX}`) as HTMLElement).style.backgroundImage = `url(./img/virus/covid_${virusColor}.png)`;
        }

        let interval = setInterval(() => {
            if (this.isStageCompleted === true) {
                clearInterval(interval);
            }
            this.animateViruses();
        }, 400);

        const scoreArr = this.viruses.length.toString().split("");
        while (scoreArr.length < 2) {
            scoreArr.unshift("0");
        }

        let div = document.getElementById("countOfViruses") as HTMLDivElement;

        div.innerHTML = "";

        for (const num of scoreArr) {
            const scoreNum = document.createElement("div");
            scoreNum.classList.add("digit");
            scoreNum.style.backgroundImage = `url("../img/digits/${num}.png")`;
            div.appendChild(scoreNum);
        }
    };


    /** 
     * Główna pętla gry
     * 
     * @memberof Game
     * @method step
     * @param {number} timestamp
     * @returns {void}
     */
    step = (timestamp: number) => {
        if (this.stepData.start === undefined) {
            this.stepData.start = timestamp;
        }

        //Sprawdzenie czy gra się zakończyła zwycięstwem
        if (this.viruses.length <= 0) {
            this.stageCompleted();

            return;
        }

        if (this.isPillOnBoard === false) {
            this.animateThrow = true;
            if (this.nextColor1 && this.nextColor2) {
                this.stopAnimation = true;

                setTimeout(() => {
                    console.log("XXXX");

                    this.checkForDelete();
                }, 200);

                let pill = new Pill();

                pill.movePreview();
                let lost = false
                if (this.board[0][3] != 0 || this.board[0][4] != 0) {
                    lost = true;
                }

                this.pill = pill.getPill(this.nextColor1, this.nextColor2);
                let firstElement = document.getElementById("pill_first") as HTMLElement;
                let secondElement = document.getElementById("pill_second") as HTMLElement;
                firstElement.style.visibility = "hidden";
                secondElement.style.visibility = "hidden";

                setTimeout(() => {
                    document.querySelectorAll(".preview_pill").forEach((element) => {
                        element.remove();
                    });

                    if (!lost) {
                        this.stopAnimation = false;

                        firstElement.style.visibility = "visible";
                        secondElement.style.visibility = "visible";

                        let preview = new Pill();
                        preview.previewPill();

                        this.nextColor1 = preview.pill.firstElement.color;
                        this.nextColor2 = preview.pill.secondElement.color;
                    } else {
                        this.isGameOver = true;
                        this.gameOver();
                        return;
                    }

                    this.animateThrow = false;
                }, 1200);

                this.isPillOnBoard = true;
                this.stepData.done = false;
            } else {
                this.stopAnimation = true;

                let preview = new Pill();
                preview.previewPill();

                this.nextColor1 = preview.pill.firstElement.color;
                this.nextColor2 = preview.pill.secondElement.color;

                this.pill = preview.getPill(this.nextColor1, this.nextColor2);
                let firstElement = document.getElementById("pill_first") as HTMLElement;
                let secondElement = document.getElementById("pill_second") as HTMLElement;
                firstElement.style.visibility = "hidden";
                secondElement.style.visibility = "hidden";

                preview.movePreview();
                setTimeout(() => {
                    this.stopAnimation = false;

                    document.querySelectorAll(".preview_pill").forEach((element) => {
                        element.remove();
                    });

                    firstElement.style.visibility = "visible";
                    secondElement.style.visibility = "visible";

                    let pill = new Pill();
                    pill.previewPill();
                    this.nextColor1 = pill.pill.firstElement.color;
                    this.nextColor2 = pill.pill.secondElement.color;

                    this.animateThrow = false;
                }, 1200);
                this.isPillOnBoard = true;
                this.stepData.done = false;

            }
        }

        let firstElement = document.getElementById("pill_first") as HTMLElement;
        let secondElement = document.getElementById("pill_second") as HTMLElement;

        const elapsed = timestamp - this.stepData.start;
        if (this.stopAnimation == false) {
            if (this.moveFastDown && this.animateThrow == false) {
                if (elapsed > 100) {
                    this.updateAfterTime(firstElement, secondElement);

                    this.stepData.previousTimeStamp = timestamp;
                    this.stepData.start = this.stepData.previousTimeStamp;
                }
            } else {
                if (elapsed > 1000) {
                    this.updateAfterTime(firstElement, secondElement);

                    this.stepData.previousTimeStamp = timestamp;
                    this.stepData.start = this.stepData.previousTimeStamp;
                }
            }
        }


        if (this.stepData.done == true) {
            this.isPillOnBoard = false;
            this.moveFastDown = false;

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

            (document.getElementById(`square_${this.pill!.firstElement.position.y}-${this.pill!.firstElement.position.x}`) as HTMLElement).style.backgroundImage = firstElement.style.backgroundImage;
            (document.getElementById(`square_${this.pill!.secondElement.position.y}-${this.pill!.secondElement.position.x}`) as HTMLElement).style.backgroundImage = secondElement.style.backgroundImage;

            firstElement.remove();
            secondElement.remove();

            this.pillsOnBoard.push({
                firstX: this.pill!.firstElement.position.x,
                firstY: this.pill!.firstElement.position.y,
                secondX: this.pill!.secondElement.position.x,
                secondY: this.pill!.secondElement.position.y
            });

            // console.log("can fall?", this.checkForFall());

            this.checkForDelete();

            this.pill = null;
        }

        window.requestAnimationFrame(this.step);
    };

    /**
     * Zupdateuj pozycje elementow po okreslonym czasie
     * 
     * @param firstElement
     * @param secondElement
     */
    updateAfterTime = (firstElement: HTMLElement, secondElement: HTMLElement) => {
        if (this.pill!.firstElement.position.y >= 15 || this.pill!.secondElement.position.y >= 15) {
            this.stepData.done = true;

        } else if (this.board[this.pill!.firstElement.position.y + 1][this.pill!.firstElement.position.x] != 0 || this.board[this.pill!.secondElement.position.y + 1][this.pill!.secondElement.position.x] != 0) {
            this.stepData.done = true;

        } else {
            this.pill!.firstElement.position.y++;
            this.pill!.secondElement.position.y++;

            firstElement.style.top = `${parseFloat(firstElement.style.top) + size}px`;
            secondElement.style.top = `${parseFloat(secondElement.style.top) + size}px`;
            firstElement.style.transform = `translateY(0px)`;
            secondElement.style.transform = `translateY(0px)`;
        }
    };

    /**
     * Animuje virusy
     * 
     * @memberof Game
     * @return {void}
     */
    animateViruses = () => {
        let speed = 0.1
        let red = false;
        let blue = false;
        let yellow = false;

        for (let i = 0; i < this.viruses.length; i++) {
            switch (this.viruses[i].color) {
                case "red":
                    red = true;
                    break;
                case "blue":
                    blue = true;
                    break;
                case "yellow":
                    yellow = true;
                    break;
            }
        }

        // Animuj czerwonego wirusa
        if (red) {
            let red_virus = document.getElementById("red_virus") as HTMLElement;
            red_virus.style.display = "block";

            if (!this.isGameOver) {
                red_virus.style.top = Math.cos(this.redRadius) * 40 + (17 * 16) + "px"
                red_virus.style.left = Math.sin(this.redRadius) * 40 + (7 * 16) + "px"
                this.redRadius += speed
                if (this.redRadius > 360) this.redRadius = 1

                switch (red_virus.style.backgroundImage) {
                    case 'url("img/magnifying_glass/red/1.png")':
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/2.png')";
                        break;

                    case 'url("img/magnifying_glass/red/2.png")':
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/3.png')";
                        break;

                    case 'url("img/magnifying_glass/red/3.png")':
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/1.png')";
                        break;

                    default:
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/1.png')";
                        break;
                }
            } else {
                switch (red_virus.style.backgroundImage) {
                    case 'url("img/magnifying_glass/red/2.png")':
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/4.png')";
                        break;

                    case 'url("img/magnifying_glass/red/4.png")':
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/2.png')";
                        break;

                    default:
                        red_virus.style.backgroundImage = "url('img/magnifying_glass/red/2.png')";
                        break;
                }
            }
        } else {
            document.getElementById("red_virus")!.style.display = "none";
        }

        // Animuj niebieskiego wirusa
        if (blue) {
            let blue_virus = document.getElementById("blue_virus") as HTMLElement;

            blue_virus.style.display = "block";

            if (!this.isGameOver) {
                blue_virus.style.top = Math.cos(this.blueRadius) * 40 + (17 * 16) + "px"
                blue_virus.style.left = Math.sin(this.blueRadius) * 40 + (7 * 16) + "px"
                this.blueRadius += speed
                if (this.blueRadius > 360) this.blueRadius = 1

                switch (blue_virus.style.backgroundImage) {
                    case 'url("img/magnifying_glass/blue/1.png")':
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/2.png')";
                        break;

                    case 'url("img/magnifying_glass/blue/2.png")':
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/3.png')";
                        break;

                    case 'url("img/magnifying_glass/blue/3.png")':
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/1.png')";
                        break;

                    default:
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/2.png')";
                        break;
                }
            } else {
                switch (blue_virus.style.backgroundImage) {
                    case 'url("img/magnifying_glass/blue/2.png")':
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/4.png')";
                        break;

                    case 'url("img/magnifying_glass/blue/4.png")':
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/2.png')";
                        break;

                    default:
                        blue_virus.style.backgroundImage = "url('img/magnifying_glass/blue/2.png')";
                        break;
                }
            }
        } else {
            document.getElementById("blue_virus")!.style.display = "none";
        }

        // Animuj zółtego wirusa
        if (yellow) {
            let yellow_virus = document.getElementById("yellow_virus") as HTMLElement;

            yellow_virus.style.display = "block";

            if (!this.isGameOver) {
                yellow_virus.style.top = Math.cos(this.yellowRadius) * 40 + (17 * 16) + "px"
                yellow_virus.style.left = Math.sin(this.yellowRadius) * 40 + (7 * 16) + "px"
                this.yellowRadius += speed
                if (this.yellowRadius > 360) this.yellowRadius = 1

                switch (yellow_virus.style.backgroundImage) {
                    case 'url("img/magnifying_glass/yellow/1.png")':
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/2.png')";
                        break;

                    case 'url("img/magnifying_glass/yellow/2.png")':
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/3.png')";
                        break;

                    case 'url("img/magnifying_glass/yellow/3.png")':
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/1.png')";
                        break;

                    default:
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/3.png')";
                        break;
                }
            } else {
                switch (yellow_virus.style.backgroundImage) {
                    case 'url("img/magnifying_glass/yellow/2.png")':
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/4.png')";
                        break;

                    case 'url("img/magnifying_glass/yellow/4.png")':
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/2.png')";
                        break;

                    default:
                        yellow_virus.style.backgroundImage = "url('img/magnifying_glass/yellow/2.png')";
                        break;
                }
            }
        } else {
            document.getElementById("yellow_virus")!.style.display = "none";
        }
    };

    /**
     * Sprawdz rzedy i kolumny do usuniecia
     * 
     * @memberof Game
     * @returns {void}
     */
    checkForDelete = () => {
        this.toDelete = [];

        // Sprawdzanie wierszy
        for (let row = 0; row <= 15; row++) {
            for (let cell = 0; cell <= 4; cell++) {
                let color = this.board[row][cell];
                let count = 0;

                if (color != 0) {
                    for (let i = cell + 1; i <= 7; i++) {
                        if (this.board[row][i] == color || this.board[row][i] == color + 3 || (color - 3 != 0 && this.board[row][i] == color - 3)) {
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


        // Sprawdzanie kolumn
        for (let column = 0; column <= 7; column++) {
            for (let row = 0; row <= 12; row++) {
                let color = this.board[row][column];
                let count = 0;

                if (color != 0) {
                    for (let i = row + 1; i <= 15; i++) {
                        if (this.board[i][column] == color || this.board[i][column] == color + 3 || (color - 3 != 0 && this.board[i][column] == color - 3)) {
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

        // Jezeli jest cos do usuniecia
        if (this.toDelete.length > 0) {
            // zbic

            this.deleteAnimation();

            // Jesli nie ma nic do usuniecia
        } else {
            // nie zbic

            this.stopAnimation = false;
        }
    };


    /**
     * Usuwanie rzedy i kolumn z animacja
     * 
     * @memberof Game
     * @returns {void}
     */
    deleteAnimation = () => {
        this.stopAnimation = true;

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

            // Usuniecie animacji
            setTimeout(() => {
                square.style.backgroundImage = "url('')";
            }, 100);

            for (let j = 0; j < this.pillsOnBoard.length; j++) {
                if (this.pillsOnBoard[j].firstX == this.toDelete[i].column && this.pillsOnBoard[j].firstY == this.toDelete[i].row) {
                    this.pillsOnBoard[j].firstX = null;
                    this.pillsOnBoard[j].firstY = null;
                }
                if (this.pillsOnBoard[j].secondX == this.toDelete[i].column && this.pillsOnBoard[j].secondY == this.toDelete[i].row) {
                    this.pillsOnBoard[j].secondX = null;
                    this.pillsOnBoard[j].secondY = null;
                }
            }

            for (let j = 0; j < this.viruses.length; j++) {
                if (this.viruses[j].position.x == this.toDelete[i].column && this.viruses[j].position.y == this.toDelete[i].row) {
                    this.viruses.splice(j, 1);

                    this.score += 100;
                    this.storage.updateScore(this.score);

                    const scoreArr = this.viruses.length.toString().split("");
                    while (scoreArr.length < 2) {
                        scoreArr.unshift("0");
                    }

                    let div = document.getElementById("countOfViruses") as HTMLDivElement;

                    div.innerHTML = "";

                    for (const num of scoreArr) {
                        const scoreNum = document.createElement("div");
                        scoreNum.classList.add("digit");
                        scoreNum.style.backgroundImage = `url("../img/digits/${num}.png")`;
                        div.appendChild(scoreNum);
                    }
                }
            }
        }

        for (let j = 0; j < this.pillsOnBoard.length; j++) {
            let countOfNull = 0;
            if (this.pillsOnBoard[j].firstX == null) {
                countOfNull++;
            }
            if (this.pillsOnBoard[j].secondX == null) {
                countOfNull++;
            }
            if (this.pillsOnBoard[j].firstY == null) {
                countOfNull++;
            }
            if (this.pillsOnBoard[j].secondY == null) {
                countOfNull++;
            }

            // tabletka ma 1 czesc
            if (countOfNull == 2) {
                let dotX = Math.max(this.pillsOnBoard[j].firstX!, this.pillsOnBoard[j].secondX!);
                let dotY = Math.max(this.pillsOnBoard[j].firstY!, this.pillsOnBoard[j].secondY!);

                let color: string = "";
                switch (this.board[dotY][dotX]) {
                    case 2:
                    case 5:
                        color = "red";
                        break;
                    case 3:
                    case 6:
                        color = "blue";
                        break;
                    case 4:
                    case 7:
                        color = "yellow";
                        break;
                }

                (document.getElementById(`square_${dotY}-${dotX}`) as HTMLElement).style.backgroundImage = getImg(color, "dot");

                // tabletka nie ma zadnych czesci wiec ja usuwamy
            } else if (countOfNull == 4) {
                this.pillsOnBoard.splice(j, 1);
            }
        }

        // Jesli moga spasc
        if (this.checkForFall() == true) {
            // spadaja
            this.fallAnimation();
        } else {
            //nie spadaja
            this.stopAnimation = false;
        }
    };


    /**
     * Sprawdzanie czy moga spasc
     * 
     * @memberof Game
     * @returns {true} jesli moga spasc
     * @returns {false} jesli nie moga spasc
     */
    checkForFall = () => {
        // console.log("checkForFall");

        for (let i = 0; i < this.pillsOnBoard.length; i++) {
            let countOfNull = 0;
            if (this.pillsOnBoard[i].firstX == null) {
                countOfNull++;
            }
            if (this.pillsOnBoard[i].secondX == null) {
                countOfNull++;
            }
            if (this.pillsOnBoard[i].firstY == null) {
                countOfNull++;
            }
            if (this.pillsOnBoard[i].secondY == null) {
                countOfNull++;
            }

            if (countOfNull == 2) {
                let dotX = Math.max(this.pillsOnBoard[i].firstX!, this.pillsOnBoard[i].secondX!);
                let dotY = Math.max(this.pillsOnBoard[i].firstY!, this.pillsOnBoard[i].secondY!);

                if (dotY + 1 <= 15 && this.board[dotY + 1][dotX] == 0) {
                    return true;
                }
            } else if (countOfNull == 4) {
                let firstX = this.pillsOnBoard[i].firstX;
                let firstY = this.pillsOnBoard[i].firstY;
                let secondX = this.pillsOnBoard[i].secondX;
                let secondY = this.pillsOnBoard[i].secondY;

                if (firstY == secondY) {
                    // poziomo
                    if (firstY! + 1 <= 15 && secondY! + 1 <= 15 && this.board[firstY! + 1][firstX!] == 0 && this.board[secondY! + 1][secondX!] == 0) {
                        return true;
                    }
                } else {
                    // pionowo
                    if (Math.max(firstY!, secondY!) + 1 <= 15 && this.board[Math.max(firstY!, secondY!) + 1][firstX!] == 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Animacja spadania
     * 
     * @memberof Game
     * @returns {void}
     */
    fallAnimation = () => {
        let speed = 50;

        for (let y = 15; y >= 0; y--) {
            for (let x = 0; x <= 7; x++) {
                for (let i = 0; i < this.pillsOnBoard.length; i++) {
                    let countOfNull = 0;
                    if (this.pillsOnBoard[i].firstX == null) {
                        countOfNull++;
                    }
                    if (this.pillsOnBoard[i].secondX == null) {
                        countOfNull++;
                    }
                    if (this.pillsOnBoard[i].firstY == null) {
                        countOfNull++;
                    }
                    if (this.pillsOnBoard[i].secondY == null) {
                        countOfNull++;
                    }

                    let firstX: number | null = null;
                    let firstY: number | null = null;
                    let secondX: number | null = null;
                    let secondY: number | null = null;

                    if (countOfNull == 2) {
                        // 1 element pill

                        firstX = Math.max(this.pillsOnBoard[i].firstX!, this.pillsOnBoard[i].secondX!);
                        firstY = Math.max(this.pillsOnBoard[i].firstY!, this.pillsOnBoard[i].secondY!);

                        let color: string = "";
                        switch (this.board[firstY][firstX]) {
                            case 2:
                            case 5:
                                color = "red";
                                break;
                            case 3:
                            case 6:
                                color = "blue";
                                break;
                            case 4:
                            case 7:
                                color = "yellow";
                                break;
                        }

                        setTimeout(() => {
                            let interval = setInterval(() => {
                                if (firstY! + 1 <= 15 && this.board[firstY! + 1][firstX!] == 0) {
                                    this.board[firstY! + 1][firstX!] = this.board[firstY!][firstX!];
                                    this.board[firstY!][firstX!] = 0;
                                    firstY!++;

                                    this.pillsOnBoard[i].firstX = firstX;
                                    this.pillsOnBoard[i].firstY = firstY;
                                    this.pillsOnBoard[i].secondX = null;
                                    this.pillsOnBoard[i].secondY = null;

                                    (document.getElementById(`square_${firstY}-${firstX}`) as HTMLElement).style.backgroundImage = getImg(color, "dot");
                                    (document.getElementById(`square_${firstY! - 1}-${firstX}`) as HTMLElement).style.backgroundImage = "url('')";
                                } else {
                                    clearInterval(interval);
                                }
                            }, speed);
                        }, speed);
                    } else if (countOfNull == 0) {
                        setTimeout(() => {
                            // 2 element pill

                            firstX = this.pillsOnBoard[i].firstX!;
                            firstY = this.pillsOnBoard[i].firstY!;
                            secondX = this.pillsOnBoard[i].secondX!;
                            secondY = this.pillsOnBoard[i].secondY!;

                            let firstColor: string = "";
                            let secondColor: string = "";
                            switch (this.board[firstY][firstX]) {
                                case 2:
                                case 5:
                                    firstColor = "red";
                                    break;
                                case 3:
                                case 6:
                                    firstColor = "blue";
                                    break;
                                case 4:
                                case 7:
                                    firstColor = "yellow";
                                    break;
                            }
                            switch (this.board[secondY][secondX]) {
                                case 2:
                                case 5:
                                    secondColor = "red";
                                    break;
                                case 3:
                                case 6:
                                    secondColor = "blue";
                                    break;
                                case 4:
                                case 7:
                                    secondColor = "yellow";
                                    break;
                            }

                            let interval = setInterval(() => {
                                if (firstX == secondX) {
                                    if (Math.max(firstY!, secondY!) + 1 <= 15 && this.board[Math.max(firstY!, secondY!) + 1][firstX!] == 0) {
                                        this.board[Math.max(firstY!, secondY!) + 1][firstX!] = this.board[Math.max(firstY!, secondY!)][firstX!];
                                        this.board[Math.min(firstY!, secondY!) + 1][firstX!] = this.board[Math.min(firstY!, secondY!)][firstX!];
                                        this.board[Math.min(firstY!, secondY!)][firstX!] = 0;

                                        firstY!++;
                                        secondY!++;

                                        this.pillsOnBoard[i].firstX = firstX;
                                        this.pillsOnBoard[i].firstY = firstY;
                                        this.pillsOnBoard[i].secondX = secondX;
                                        this.pillsOnBoard[i].secondY = secondY;

                                        let firstDirection: string = "";
                                        let secondDirection: string = "";

                                        if (firstY! > secondY!) {
                                            firstDirection = "down";
                                            secondDirection = "up";
                                        } else {
                                            firstDirection = "up";
                                            secondDirection = "down";
                                        }

                                        (document.getElementById(`square_${Math.min(firstY!, secondY!) - 1}-${firstX}`) as HTMLElement).style.backgroundImage = "url('')";

                                        (document.getElementById(`square_${firstY}-${firstX}`) as HTMLElement).style.backgroundImage = getImg(firstColor, firstDirection);
                                        (document.getElementById(`square_${secondY}-${secondX}`) as HTMLElement).style.backgroundImage = getImg(secondColor, secondDirection);
                                    } else {
                                        clearInterval(interval);
                                    }
                                } else {
                                    if (Math.max(firstY!, secondY!) + 1 <= 15 && this.board[Math.max(firstY!, secondY!) + 1][firstX!] == 0 && this.board[Math.max(firstY!, secondY!) + 1][secondX!] == 0) {
                                        this.board[Math.max(firstY!, secondY!) + 1][firstX!] = this.board[firstY!][firstX!];
                                        this.board[Math.max(firstY!, secondY!) + 1][secondX!] = this.board[secondY!][secondX!];
                                        this.board[firstY!][firstX!] = 0;
                                        this.board[secondY!][secondX!] = 0;

                                        firstY!++;
                                        secondY!++;

                                        this.pillsOnBoard[i].firstX = firstX;
                                        this.pillsOnBoard[i].firstY = firstY;
                                        this.pillsOnBoard[i].secondX = secondX;
                                        this.pillsOnBoard[i].secondY = secondY;

                                        let firstDirection: string = "";
                                        let secondDirection: string = "";

                                        if (firstX! < secondX!) {
                                            firstDirection = "left";
                                            secondDirection = "right";
                                        } else {
                                            firstDirection = "right";
                                            secondDirection = "left";
                                        }

                                        (document.getElementById(`square_${firstY}-${firstX}`) as HTMLElement).style.backgroundImage = getImg(firstColor, firstDirection);
                                        (document.getElementById(`square_${secondY}-${secondX}`) as HTMLElement).style.backgroundImage = getImg(secondColor, secondDirection);

                                        (document.getElementById(`square_${firstY! - 1}-${firstX}`) as HTMLElement).style.backgroundImage = "url('')";
                                        (document.getElementById(`square_${secondY! - 1}-${secondX}`) as HTMLElement).style.backgroundImage = "url('')";

                                    } else {
                                        clearInterval(interval);
                                    }
                                }
                            }, speed);
                        }, speed);
                    }
                }
            }
        }

        setTimeout(() => {
            this.stopAnimation = false;
        }, 200);
    };

    /**
     * Funkcja do konca gry - zwyciestwo
     * 
     * @memberof Game
     */
    stageCompleted = () => {
        let stage_completed = document.createElement("div");
        stage_completed.classList.add("stage_completed");
        document.body.appendChild(stage_completed);

        this.isStageCompleted = true;

        this.stopAnimation = true;
    };


    /**
     * Funkcja do konca gry - przegrana
     * 
     * @memberof Game
     */
    gameOver = () => {
        let doctor_lost = document.getElementById("doctor") as HTMLElement;
        doctor_lost.style.backgroundImage = "url(./img/doctor/doctor_lost.png)";

        let game_over = document.createElement("div");
        game_over.classList.add("game_over");
        document.body.appendChild(game_over);

        this.isGameOver = true;

        this.stopAnimation = true;
    };
}