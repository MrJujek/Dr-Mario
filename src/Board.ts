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
    }

    getBoard() {
        return this.board;
    }
}