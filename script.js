const GameController = (function() {
    function Cell() {
        let value = "_";

        const setToken = (token) => {
            value = token;
        };

        const getValue = () => value;

        return {
            setToken,
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

        const getNumOfRows = () => rows;
        const getNumOfColumns = () => columns;

        const chooseCell = (row, column, player) => {
            if (board[row][column].getValue() != "_") {
                return false;
            }

            board[row][column].setToken(player);
            return true;
        };

        const printBoard = () => {
            let boardString = "";
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    boardString += board[i][j].getValue() + " ";
                }
                boardString += "\n";
            }
            console.log(boardString);
        };

        const checkGotEmptyCell = () => {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    if (board[i][j].getValue() === "_") {
                        return true;
                    }
                }
            }

            return false;
        }

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
            getNumOfRows,
            getNumOfColumns,
            chooseCell,
            printBoard,
            checkWinner,
            checkGotEmptyCell
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

    let activePlayer = players[0];
    let winner = "";

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const playRound = (row, column) => {
        board.chooseCell(row, column, getActivePlayer().token);

        console.log(
            `${getActivePlayer().name}'s token (${getActivePlayer().token})` + 
            ` is placed at ${row}, ${column}`
        );

        winner = board.checkWinner();
        
        if (winner != "") {
            for (let i = 0; i < 2; ++i) {
                if (winner === players[i].token) {
                    winner = players[i];
                    console.log(`${winner.name} wins!`);
                    return `${winner.name} wins!`;
                }
            }
            board.printBoard();
        }
        else {
            if (board.checkGotEmptyCell()) {
                switchPlayerTurn();
                printRound();
            }
            else {
                board.printBoard();
                console.log(`Draw!`);
                return "No more available moves. Draw!"
            }
        }

        return "";
    };
 
    return {
        getActivePlayer,
        getBoard: board.getBoard,
        playRound
    };
})();

const ScreenController = (function() {
    const gameboardDiv = document.querySelector("#gameboard");
    const infoP = document.querySelector("#info");

    const updateInfo = (text = "") => {
        if (text === "") {
            let infoText = GameController.getActivePlayer().name + "'s (";
            infoText += GameController.getActivePlayer().token + ") Turn";
            infoP.textContent = infoText;
        }
        else {
            infoP.textContent = text;
            disableGame();
        }
    };

    const updateBoard = () => {
        const gameBoard = GameController.getBoard();
        updateInfo();

        for (let i = 0; i < gameBoard.length; ++i) {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row");

            for (let j = 0; j < gameBoard[i].length; ++j) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.cellCoords = i + "-" + j;
                cellButton.textContent = " ";

                cellButton.addEventListener('click', () => {
                    switch (GameController.getActivePlayer().token) {
                        case "X":
                            cellButton.classList.add("token-X");
                            break;
                        case "O":
                            cellButton.classList.add("token-O");
                            break;
                    }

                    let returnText = GameController.playRound(i, j);
                    cellButton.disabled = true;
                    updateInfo(returnText);
                });

                rowDiv.appendChild(cellButton);
            }

            gameboardDiv.appendChild(rowDiv);
        }
    };

    const disableGame = () => {
        const cellButtons = document.querySelectorAll(".cell");
        cellButtons.forEach((button) => {
            button.disabled = true;
        });
    };

    return {
        updateBoard
    };
})();

ScreenController.updateBoard();