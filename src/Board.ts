interface BoardClassInterface {
    board: number[][];
    makeBoard(rows: number, columns: number): void;
    getBoard(): number[][];
}

export const size = 16;

export default class Board implements BoardClassInterface {
    board: number[][] = [[]];

    constructor(columns: number, rows: number) {
        for (let i = 0; i < rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < columns; j++) {
                this.board[i][j] = 0;
            }
        }

        this.makeBoard(rows, columns);
    }

    makeBoard(rows: number, columns: number) {
        let board = document.getElementById("board") as HTMLElement;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let square = document.createElement("div");
                square.classList.add("square");
                square.style.top = `${i * size}px`;
                square.style.left = `${j * size}px`;
                square.id = `square_${i}-${j}`;
                square.style.backgroundColor = "black";

                board.appendChild(square);
            }
        }

        board.style.width = `${columns * size}px`;
        board.style.height = `${rows * size}px`;
    }

    getBoard() {
        return this.board;
    }
}

/*
    0 - puste pole
    2 - lek czerwony
    3 - lek niebieski
    4 - lek żółty
    5 - virus czerwony
    6 - virus niebieski
    7 - virus żółty
*/