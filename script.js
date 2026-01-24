const GameController = (function() {
    function Cell() {
        let value = " ";

        const addToken = (token) => {
            value = token;
        };

        const getValue = () => value;

        return {
            addToken,
            getValue
        };
    }

    function GameBoard() {
        const rows = 3;
        const columns = 3;
        const board = [];

        for (let i = 0; i < rows; ++i) {
            board[i] = [];
            for (let j = 0; j < columns; ++j) {
                board[i].push(Cell());
            }
        }

        const getBoard = () => board;

        const chooseCell = (row, column, player) => {
            board[row][column].addToken(player);
        };

        const printBoard = () => {
            const boardWithCellValues = board.map(
                (row) => row.map(
                    (cell) => cell.getValue()
                )
            );
            console.log(boardWithCellValues);
        };

        return {
            getBoard,
            chooseCell,
            printBoard
        };
    }

    
})();