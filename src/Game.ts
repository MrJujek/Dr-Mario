import Board from "./Board.js";

interface virusPosition {
    x: number;
    y: number;
}

interface viruses {
    color: string;
    position: virusPosition;
}

const virusColors = [
    "red",
    "blue",
    "yellow",
    "green",
    "purple",
    "orange",
    "cyan",
    "pink",
    "brown",
    "black"
];

export default class Game {
    level: number;
    board: number[][];
    viruses: viruses[];
    constructor() {
        this.board = new Board(8, 16).getBoard();
        this.viruses = [];
        this.level = 1;
        console.log("Game constructor");
        console.log(this.board);

    }

    start() {
        for (let i = 0; i < (this.level + 2 > 10 ? 10 : this.level + 2); i++) {
            let virusX = Math.floor(Math.random() * 8);
            let virusY = Math.floor(Math.random() * 8) + 8;
            let virusColor = virusColors[Math.floor(Math.random() * 10)];

            while (this.board[virusX][virusY] !== 0) {
                virusX = Math.floor(Math.random() * 8);
                virusY = Math.floor(Math.random() * 16);
            }

            this.viruses.push({
                color: virusColor,
                position: {
                    x: virusX,
                    y: virusY
                }
            });
        }
        console.log(this.viruses.length);
        console.log(this.viruses);
    }
}