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

        const restartBoard = () => {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    board[i][j].setToken("_");
                }
            }
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
            restartBoard,
            checkWinner,
            checkGotEmptyCell
        };
    }

    const board = GameBoard();

    const players = [
        {
            name: "PLAYER ONE",
            token: "X"
        },
        {
            name: "PLAYER TWO",
            token: "O"
        }
    ];

    const editPlayerNames = (p1Name, p2Name) => {
        if (p1Name.trim() != "") {
            players[0].name = p1Name;
        }

        if (p2Name.trim() != "") {
            players[1].name = p2Name;
        }
    };

    let activePlayer = players[0];
    let winner = "";

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getPlayers = () => players;

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
                    return `${winner.token}`;
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
                return "DRAW";
            }
        }

        return "";
    };

    const restartBoard = () => {
        board.restartBoard();
        if (activePlayer.token != "X") {
            switchPlayerTurn();
        }
    };

    const getBotTurnCoords = (mode = "EASY") => {
        const filteredEmptyCells = board.getBoard()
        .flat()
        .map((cell, index) => {
            const row = Math.round(index / 3);
            const col = index % 3;
            const coords = row + "-" + col;
            return {
                coord: coords, 
                value: cell.getValue()
            };
        })
        .filter(cell => {
            return cell.value === "_";
        });
        //console.log(filteredEmptyCells);

        const randomIndex = Math.floor(
            Math.random() * filteredEmptyCells.length
        );

        switch (mode) {
            case "EASY":
                return filteredEmptyCells[randomIndex].coord;
        }
    };
 
    return {
        getActivePlayer,
        getPlayers,
        editPlayerNames,
        getBoard: board.getBoard,
        restartBoard,
        playRound,
        getBotTurnCoords
    };
})();

const ScreenController = (function() {
    const menuDialog = document.querySelector("#main-menu");
    const pvpDialog = document.querySelector("#pvp-menu");
    const pvbDialog = document.querySelector("#pvb-menu");

    const gameboardDiv = document.querySelector("#gameboard");
    const scoreboardDiv = document.querySelector("#scoreboard");
    const playerOneDiv = scoreboardDiv.querySelector("#player-one");
    const playerTwoDiv = scoreboardDiv.querySelector("#player-two");

    const updateScoreboard = (result = "") => {
        switch (GameController.getActivePlayer().token) {
            case "X":
                playerOneDiv.classList.add("active-player");
                playerTwoDiv.classList.remove("active-player");
                break;
            case "O":
                playerOneDiv.classList.remove("active-player");
                playerTwoDiv.classList.add("active-player");
                break;
        }

        let score = 0;
        switch (result) {
            case "X":
                score = +playerOneDiv.children[2].textContent;
                playerOneDiv.children[2].textContent = score + 1;
                break;
            case "O":
                score = +playerTwoDiv.children[2].textContent;
                playerTwoDiv.children[2].textContent = score + 1;
                break;
        }

        if (result != "") {
            const cellButtons = document.querySelectorAll(".cell");
            cellButtons.forEach(cellBtn => {
                cellBtn.disabled = true;
            });

            setTimeout(() => {
                restartGame();

                cellButtons.forEach(cellBtn => {
                    if (cellBtn.textContent === " ") {
                        cellBtn.disabled = false;
                    }
                });
            }, 1000);
        }
    };

    const updateGameboard = () => {
        const gameBoard = GameController.getBoard();
        updateScoreboard();

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
                            cellButton.textContent = "X";
                            break;
                        case "O":
                            cellButton.textContent = "O";
                            break;
                    }

                    console.log("HELLO!");

                    let result = GameController.playRound(i, j);
                    cellButton.disabled = true;
                    updateScoreboard(result);

                    if (GameController.getActivePlayer().name === "BOT") {
                        console.log("AI run!");
                        aiTurn();
                    }
                });

                rowDiv.appendChild(cellButton);
            }

            gameboardDiv.appendChild(rowDiv);
        }
    };

    const restartGame = () => {
        GameController.restartBoard();

        let child = gameboardDiv.lastElementChild;
        while (child) {
            gameboardDiv.removeChild(child);
            child = gameboardDiv.lastElementChild;
        }
        updateGameboard();

        if (playerOneDiv.classList.contains("active-player") === false) {
            playerOneDiv.classList.add("active-player");
        }

        if (playerTwoDiv.classList.contains("active-player")) {
            playerTwoDiv.classList.remove("active-player");
        }

        if (GameController.getActivePlayer().name === "BOT") {
            aiTurn();
        }
    };

    const updatePlayerNames = (isPvp = true) => {
        let playerOneName;
        let playerTwoName;

        if (isPvp) {
            playerOneName = document.getElementById("pvp-p1").value;
            playerTwoName = document.getElementById("pvp-p2").value;
        }
        else {
            let playerName = document.getElementById("pvb-player").value;
            if (playerName.trim() === "") {
                playerName = "PLAYER";
            }
            const selectedToken = document.querySelector(
                'input[name="pvb-token"]:checked'
            );
            if (selectedToken.value === "X") {
                playerOneName = playerName;
                playerTwoName = "BOT";
            }
            else {
                playerOneName = "BOT";
                playerTwoName = playerName;
            }
        }

        GameController.editPlayerNames(
            playerOneName.toUpperCase(), 
            playerTwoName.toUpperCase()
        );
        
        playerOneDiv.children[1].textContent = 
            GameController.getPlayers()[0].name;
        playerTwoDiv.children[1].textContent = 
            GameController.getPlayers()[1].name;
    };

    const setButtonsEventListeners = () => {
        menuDialog.showModal();
        pvpDialog.close();

        document.getElementById("pvp-btn").addEventListener('click', () => {
            menuDialog.close();
            pvpDialog.showModal();
        });

        document.getElementById("pvb-btn").addEventListener('click', () => {
            menuDialog.close();
            pvbDialog.showModal();
        });

        document.getElementById("back-pvp").addEventListener('click', () => {
            pvpDialog.close();
            menuDialog.showModal();
        });

        document.getElementById("start-pvp").addEventListener('click', () => {
            updatePlayerNames(true);
            pvpDialog.close();
            restartGame();
        });

        document.getElementById("back-pvb").addEventListener('click', () => {
            pvbDialog.close();
            menuDialog.showModal();
        });

        document.getElementById("start-pvb").addEventListener('click', () => {
            updatePlayerNames(false);
            pvbDialog.close();
            restartGame();
        });
    };

    const aiTurn = (mode = "EASY") => {
        const cellButtons = document.querySelectorAll(".cell");

        const coords = GameController.getBotTurnCoords();

        // disable all cell buttons
        cellButtons.forEach(cellBtn => {
            cellBtn.disabled = true;
        });
        
        // set timer for 2 seconds
        setTimeout(() => {
            let theCellButton = document.querySelector(
                'button[data-cell-coords="' + coords + '"]'
            );
            theCellButton.disabled = false;
            theCellButton.click();

            // enable all cell buttons
            cellButtons.forEach(cellBtn => {
                if (cellBtn.textContent === " ") {
                    cellBtn.disabled = false;
                }
            });
        }, 2000);
    };

    setButtonsEventListeners();
})();