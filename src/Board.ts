export default class Board {
    board: number[][];
    constructor(columns: number, rows: number) {
        this.board = [[]];

        for (let i = 0; i < rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < columns; j++) {
                this.board[i][j] = 0;
            }
        }

        this.makeBoard(rows, columns);
    }

    makeBoard(rows: number, columns: number) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let square = document.createElement("div");
                square.classList.add("square");
                square.style.top = `${i * 50}px`;
                square.style.left = `${j * 50}px`;
                square.id = `square_${i}-${j}`;

                (document.getElementById("main") as HTMLElement).appendChild(square);
            }
        }
    }

    getBoard() {
        return this.board;
    }
}