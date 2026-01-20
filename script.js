function Cell() {
    let value = "";

    const addToken = (token) => {
        value = token;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

const GameBoard = (function() {
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

    };

    const printBoard = () => {

    };

    return {
        getBoard,
        chooseCell,
        printBoard
    };
})();

const GameController = (function() {
    
})();