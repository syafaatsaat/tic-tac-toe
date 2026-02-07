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

        const chooseCell = (row, column, token) => {
            // if (board[row][column].getValue() != "_") {
            //     return false;
            // }

            board[row][column].setToken(token);
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
                if (board[i][0].getValue() === board[i][1].getValue() 
                    && board[i][1].getValue() === board[i][2].getValue()) 
                {
                    if (board[i][0].getValue() === "X") {
                        return "X";
                    }
                    else if (board[i][0].getValue() === "O") {
                        return "O";
                    }
                }

                if (board[0][i].getValue() === board[1][i].getValue()
                    && board[1][i].getValue() === board[2][i].getValue()) 
                {
                    if (board[0][i].getValue() === "X") {
                        return "X";
                    }
                    else if (board[0][i].getValue() === "O") {
                        return "O";
                    }
                }
            }

            if (board[0][0].getValue() === board[1][1].getValue() 
                && board[1][1].getValue() === board[2][2].getValue()) 
            {
                if (board[0][0].getValue() === "X") {
                    return "X";
                }
                else if (board[0][0].getValue() === "O") {
                    return "O";
                }
            }

            if (board[0][2].getValue() === board[1][1].getValue() 
                && board[1][1].getValue()  === board[2][0].getValue()) 
            {
                if (board[0][2].getValue() === "X") {
                    return "X";
                }
                else if (board[0][2].getValue() === "O") {
                    return "O";
                }
            }

            return "";
        };

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

    function BotSystem() {
        let botToken = "X";
        let playerToken = "O";
        let difficulty = "EASY";

        const setTokens = (bot, player) => {
            botToken = bot;
            playerToken = player;
        };

        const setDifficulty = (mode) => {
            difficulty = mode;
        };

        const getEmptyCells = () => {
            return board.getBoard()
                .flat()
                .map((cell, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    return {
                        row,
                        col,
                        value: cell.getValue()
                    };
                })
                .filter(cell => {
                    return cell.value === "_";
                });
        };

        const findWinningMove = (token) => {
            const emptyCells = getEmptyCells();
            for (const cell of emptyCells) {
                let i = cell.row;
                let j = cell.col;
                board.chooseCell(i, j, token);

                if (board.checkWinner() === token) {
                    board.chooseCell(i, j, "_");
                    return cell;
                }

                board.chooseCell(i, j, "_");
            }

            return null;
        };

        const findForkMove = (token) => {
            const emptyCells = getEmptyCells();
            // not enough space to create a folk
            if (emptyCells.length < 5)
                return null;

            for (const cell of emptyCells) {
                let i = cell.row;
                let j = cell.col;
                let winChances = 0;
                board.chooseCell(i, j, token);

                const updatedEmptyCells = getEmptyCells();
                for (const tempCells of updatedEmptyCells) {
                    let x = tempCells.row;
                    let y = tempCells.col;
                    board.chooseCell(x, y, token);

                    if (board.checkWinner() === token)
                        winChances++;

                    board.chooseCell(x, y, "_");
                }

                board.chooseCell(i, j, "_");

                if (winChances >= 2)
                    return cell;
            }

            return null;
        };

        const getRandomMove = () => {
            const emptyCells = getEmptyCells();
            console.log(emptyCells);

            if (emptyCells.length > 0) {
                return emptyCells[
                    Math.floor(Math.random() * emptyCells.length)
                ];
            }

            return null;
        };

        // Easy AI: If player can win, blocks the player's play
        // ELSE, has a small chance of making a smart move
        // OTHERWISE make a random move
        const getEasyMove = () => {
            let blockMove = findWinningMove(playerToken);
            if (blockMove !== null)
                return blockMove;

            if (Math.random() < 0.20) {
                let winningMove = findWinningMove(botToken);
                if (winningMove !== null)
                    return winningMove;
            }

            return getRandomMove();
        };

        // Medium AI: Uses basic strategy (win -> block -> center)
        // BUT has a chance for making random mistake
        const getMediumMove = () => {
            if (Math.random() < 0.25)
                return getRandomMove();

            let winningMove = findWinningMove(botToken);
            if (winningMove !== null)
                return winningMove;

            let blockMove = findWinningMove(playerToken);
            if (blockMove !== null)
                return blockMove;

            if (board.getBoard()[1][1].getValue() === "_")
                return { row: 1, col: 1 };

            return getRandomMove();
        };

        // Hard AI: Follows a strict set of optimal moves
        const getHardMove = () => {
            let winningMove = findWinningMove(botToken);
            if (winningMove !== null)
                return winningMove;

            let blockMove = findWinningMove(playerToken);
            console.log(blockMove);
            if (blockMove !== null)
                return blockMove;

            let forkMove = findForkMove(botToken);
            if (forkMove !== null)
                return forkMove;

            let blockForkMove = findForkMove(playerToken);
            if (blockForkMove !== null)
                return blockForkMove;

            if (board.getBoard()[1][1].getValue() === "_")
                return { row: 1, col: 1 };

            const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
            const playerCorners = corners.filter(
                c => board.getBoard()[c[0]][c[1]].getValue() === playerToken
            );
            if (playerCorners.length === 1) {
                const i = Math.abs(playerCorners[0][0] - 2);
                const j = Math.abs(playerCorners[0][1] - 2);
                console.log(i, j);
                if (board.getBoard()[i][j].getValue() === "_")
                    return { row: i, col: j };
            }

            const emptyCorners = corners.filter(
                c => board.getBoard()[c[0]][c[1]].getValue() === "_"
            );
            if (emptyCorners.length > 0) {
                let randomCorner = emptyCorners[
                    Math.floor(Math.random() * emptyCorners.length)
                ];
                return { 
                    row: randomCorner[0], 
                    col: randomCorner[1] 
                };
            }

            return getRandomMove();
        };

        const getBotMove = () => {
            switch (difficulty) {
                case "EASY":
                    return getEasyMove();
                case "MEDIUM":
                    return getMediumMove();
                case "HARD":
                    return getHardMove();
            };
        };

        return {
            setTokens,
            setDifficulty,
            getBotMove
        }
    }

    const board = GameBoard();
    const botSystem = BotSystem();

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
 
    return {
        getActivePlayer,
        getPlayers,
        editPlayerNames,
        getBoard: board.getBoard,
        setDifficulty: botSystem.setDifficulty,
        setPVBTokens: botSystem.setTokens,
        restartBoard,
        playRound,
        getBotMove: botSystem.getBotMove
    };
})();

const ScreenController = (function() {
    const menuDialog = document.querySelector("#main-menu");
    const pvpDialog = document.querySelector("#pvp-menu");
    const pvbDialog = document.querySelector("#pvb-menu");

    const gameboardDiv = document.querySelector("#gameboard");
    const scoreboardDiv = document.querySelector("#scoreboard");
    const gameNavDiv = document.querySelector("#game-nav");

    const updateScoreboard = (result = "") => {
        const playerOneDiv = scoreboardDiv.querySelector("#player-one");
        const playerTwoDiv = scoreboardDiv.querySelector("#player-two");

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

    const renderGameMenuButtons = () => {
        const restartBtn = document.createElement("button");
        restartBtn.setAttribute("id", "restart-btn");
        restartBtn.textContent = "RESTART";
        restartBtn.addEventListener('click', () => {
            restartGame();
        });

        const mainMenuBtn = document.createElement("button");
        mainMenuBtn.setAttribute("id", "main-menu-btn");
        mainMenuBtn.textContent = "QUIT";
        mainMenuBtn.addEventListener('click', () => {
            clearScoreboardAndMenuButtons();
            clearGameboard();
            menuDialog.show();
        });

        gameNavDiv.appendChild(restartBtn);
        gameNavDiv.appendChild(mainMenuBtn);
    };

    const renderScoreboard = () => {
        const playerOneDiv = document.createElement("div");
        playerOneDiv.setAttribute("id", "player-one");
        playerOneDiv.classList.add("player-col");

        const p1TokenP = document.createElement("p");
        p1TokenP.textContent = "[X]";
        const p1NameP = document.createElement("p");
        p1NameP.textContent = GameController.getPlayers()[0].name;
        const p1ScoreP = document.createElement("p");
        p1ScoreP.textContent = "0";

        playerOneDiv.appendChild(p1TokenP);
        playerOneDiv.appendChild(p1NameP);
        playerOneDiv.appendChild(p1ScoreP);

        const playerTwoDiv = document.createElement("div");
        playerTwoDiv.setAttribute("id", "player-two");
        playerTwoDiv.classList.add("player-col");

        const p2TokenP = document.createElement("p");
        p2TokenP.textContent = "[O]";
        const p2NameP = document.createElement("p");
        p2NameP.textContent = GameController.getPlayers()[1].name;
        const p2ScoreP = document.createElement("p");
        p2ScoreP.textContent = "0";

        playerTwoDiv.appendChild(p2TokenP);
        playerTwoDiv.appendChild(p2NameP);
        playerTwoDiv.appendChild(p2ScoreP);

        scoreboardDiv.appendChild(playerOneDiv);
        scoreboardDiv.appendChild(playerTwoDiv);
    };

    const renderGameboard = () => {
        const gameBoard = GameController.getBoard();

        updateScoreboard();

        for (let i = 0; i < gameBoard.length; ++i) {
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

                gameboardDiv.appendChild(cellButton);
            }
        }
    };

    const clearScoreboardAndMenuButtons = () => {
        let child = scoreboardDiv.lastElementChild;
        while (child) {
            scoreboardDiv.removeChild(child);
            child = scoreboardDiv.lastElementChild;
        }

        child = gameNavDiv.lastElementChild;
        while (child) {
            gameNavDiv.removeChild(child);
            child = gameNavDiv.lastElementChild;
        }
    };

    const clearGameboard = () => {
        let child = gameboardDiv.lastElementChild;
        while (child) {
            gameboardDiv.removeChild(child);
            child = gameboardDiv.lastElementChild;
        }
    };

    const restartGame = () => {
        const playerOneDiv = scoreboardDiv.querySelector("#player-one");
        const playerTwoDiv = scoreboardDiv.querySelector("#player-two");

        GameController.restartBoard();

        clearGameboard();
        renderGameboard();

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
                GameController.setPVBTokens("O", "X");
            }
            else {
                playerOneName = "BOT";
                playerTwoName = playerName;
                GameController.setPVBTokens("X", "O");
            }

            const selectedDifficulty = document.querySelector(
                'input[name="pvb-difficulty"]:checked'
            );
            console.log(selectedDifficulty.value);
            GameController.setDifficulty(selectedDifficulty.value);
        }

        GameController.editPlayerNames(
            playerOneName.toUpperCase(), 
            playerTwoName.toUpperCase()
        );
    };

    const setButtonsEventListeners = () => {
        pvpDialog.close();

        document.getElementById("pvp-btn").addEventListener('click', () => {
            menuDialog.close();
            pvpDialog.show();
        });

        document.getElementById("pvb-btn").addEventListener('click', () => {
            menuDialog.close();
            pvbDialog.show();
        });

        document.getElementById("back-pvp").addEventListener('click', () => {
            pvpDialog.close();
            menuDialog.show();
        });

        document.getElementById("start-pvp").addEventListener('click', () => {
            updatePlayerNames(true);
            pvpDialog.close();
            renderScoreboard();
            renderGameMenuButtons();
            restartGame();
        });

        document.getElementById("back-pvb").addEventListener('click', () => {
            pvbDialog.close();
            menuDialog.show();
        });

        document.getElementById("start-pvb").addEventListener('click', () => {
            updatePlayerNames(false);
            pvbDialog.close();
            renderScoreboard();
            renderGameMenuButtons();
            restartGame();
        });
    };

    const aiTurn = () => {
        const cellButtons = document.querySelectorAll(".cell");

        const coords = GameController.getBotMove();

        // disable all cell buttons
        cellButtons.forEach(cellBtn => {
            cellBtn.disabled = true;
        });
        
        // set timer for 2 seconds
        setTimeout(() => {
            console.log(coords);
            let dataCoords = coords.row + "-" + coords.col;
            let theCellButton = document.querySelector(
                'button[data-cell-coords="' + dataCoords + '"]'
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