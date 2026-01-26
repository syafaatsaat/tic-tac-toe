const GameController = (function() {
    function Cell() {
        let value = "_";

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

        const checkWinner = () => {
            for (let i = 0; i < 3; ++i) {
                if (board[i][0].getValue() === "X" 
                    && board[i][1].getValue() === "X" 
                    && board[i][2].getValue() === "X") {
                    return "X";
                }
                else if (board[i][0].getValue() === "O" 
                    && board[i][1].getValue() === "O" 
                    && board[i][2].getValue() === "O") {
                    return "O";
                }

                if (board[0][i].getValue() === "X" 
                    && board[1][i].getValue() === "X" 
                    && board[2][i].getValue() === "X") {
                    return "X";
                }
                else if (board[0][i].getValue() === "O" 
                    && board[1][i].getValue() === "O" 
                    && board[2][i].getValue() === "O") {
                    return "O";
                }
            }

            if (board[0][0].getValue() === "X" 
                && board[1][1].getValue() === "X" 
                && board[2][2].getValue() === "X") {
                return "X";
            }
            else if (board[0][0].getValue() === "O" 
                && board[1][1].getValue() === "O" 
                && board[2][2].getValue() === "O") {
                return "O";
            }

            if (board[0][2].getValue() === "X" 
                && board[1][1].getValue() === "X" 
                && board[2][0].getValue() === "X") {
                return "X";
            }
            else if (board[0][2].getValue() === "O" 
                && board[1][1].getValue() === "O" 
                && board[2][0].getValue() === "O") {
                return "O";
            }

            return "";
        }

        return {
            getBoard,
            chooseCell,
            printBoard,
            checkWinner
        };
    }

    const board = GameBoard();

    const players = [
        {
            name: "Player One",
            token: "X"
        },
        {
            name: "Player Two",
            token: "O"
        }
    ];

    const setPlayerName = (token, name) => {
        if (!(token in ["X", "O"])) {
            console.log("Invalid token!");
            return;
        }

        if (token === "X") {
            players[0].name = name;
        }
        else if (token === "O") {
            players[1].name = name;
        }
    };

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const playRound = (row, column) => {
        console.log(
            `${getActivePlayer().name}'s token (${getActivePlayer().token}) is 
            placed at ${row}, ${column}`
        );

        board.chooseCell(row, column, getActivePlayer().token);

        const winner = board.checkWinner();
        
        for (let i = 0; i < 2; ++i) {
            if (winner === players[i].token) {
                console.log(`${players[i].name} wins!`);
                break;
            }
        }
        
        switchPlayerTurn();

        printRound();
    };

    printRound();

    return {
        setPlayerName,
        getActivePlayer,
        getBoard: board.getBoard,
        playRound
    };
})();
