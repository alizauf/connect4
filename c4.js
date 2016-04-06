$(document).ready(function() {
    function Board(width, height) {
        this.width = width
        this.height = height
    }

    Board.prototype.createBoard = function() {
        var board = []
        for (var i = 0; i < this.height; i++) {
            var row = []
            board.push(row)
            for (var j = 0; j < this.width; j++) {
                board[i].push(0)
            }
        }
        return board
    }

    Board.prototype.displayBoard = function(board, player) {
        $('div.board').replaceWith("<div class='board'></div>")
        this.createSelectionArea(player)
        var colorDict = {
            0: 'white',
            1: 'red',
            2: 'black'
        }

        for (var i = 0; i < board.length; i++) {
            $('.board').append("<div class='row' id='row" + i + "'></div>")
            for (var j = 0; j < board[i].length; j++) {
                $('#row' + i).append("<div class='slot' id=" + j + "><div class='hole " + colorDict[board[i][j]] + "'></div></div>")
            }
        }

        this.moveListener(player)
    }

    Board.prototype.moveListener = function(player) {
        $('.selector').click(function(event) {
            state = newGame.playTurn(state[0], state[1], event.target.id, player)
        })
    }

    Board.prototype.createSelectionArea = function(player) {
        $('.board').append("<div class='selectionArea'></div>")
        for (var i = 0; i < this.width; i++) {
            $('.selectionArea').append("<div class='selector " + player.color + "Selector' id=" + i + '></div>')
        }
    }

    Board.prototype.whereToDrop = function(board, count, column, player) {
        if (board[count][column] === 0) {
            board[count][column] = player.num
            var lastMove = [count, parseInt(column)]
            return [board, lastMove]
        } else {
            count -= 1
            return this.whereToDrop(board, count, column, player)
        }
    }

    Board.prototype.isDraw = function(board) {
        if (board[0].indexOf(0) < 0) {
            return true
        }
    }

    Board.prototype.isWinner = function(board, lastMove, player) {
        if (this.horizontalWin(board, lastMove, player) || this.verticalWin(board, lastMove, player) || this.diagonalWinPositiveSlope(board, lastMove, player) || this.diagonalWinNegativeSlope(board, lastMove, player)) {
            return true
        }
    }

    Board.prototype.searchHorizontalLeft = function(board, move, winNum, player) {
        if (move[1] === 0 || board[move[0]][move[1] - 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0], move[1] - 1]
            return this.searchHorizontalLeft(board, move, winNum, player)
        }
    }

    Board.prototype.searchHorizontalRight = function(board, move, winNum, player) {
        if (move[1] === 6 || board[move[0]][move[1] + 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0], move[1] + 1]
            return this.searchHorizontalRight(board, move, winNum, player)
        }
    }

    Board.prototype.horizontalWin = function(board, lastMove, player) {
        var winNum = 1
        winNum = this.searchHorizontalLeft(board, lastMove, winNum, player)
        if (winNum === 4) {
            return true
        } else {
            winNum = this.searchHorizontalRight(board, lastMove, winNum, player)
        }
        if (winNum === 4) {
            return true
        }
    }

    Board.prototype.searchVertical = function(board, move, winNum, player) {
        if (move[0] === 5 || board[move[0] + 1][move[1]] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] + 1, move[1]]
            return this.searchVertical(board, move, winNum, player)
        }
    }

    Board.prototype.verticalWin = function(board, lastMove, player) {
        var winNum = 1
        if (lastMove[0] > 2) {
            return false
        } else {
            winNum = this.searchVertical(board, lastMove, winNum, player)
            if (winNum === 4) {
                return true
            }
        }
    }

    Board.prototype.searchDiagonalUpRight = function(board, move, winNum, player) {
        if (move[0] === 0 || move[1] === 6 || board[move[0] - 1][move[1] + 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] - 1, move[1] + 1]
            return this.searchDiagonalUpRight(board, move, winNum, player)
        }
    }

    Board.prototype.searchDiagonalDownLeft = function(board, move, winNum, player) {
        if (move[0] === 5 || move[1] === 0 || board[move[0] + 1][move[1] - 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] + 1, move[1] - 1]
            return this.searchDiagonalDownLeft(board, move, winNum, player)
        }
    }

    Board.prototype.diagonalWinPositiveSlope = function(board, lastMove, player) {
        var winNum = 1
        winNum = this.searchDiagonalUpRight(board, lastMove, winNum, player)
        if (winNum === 4) {
            return true
        } else {
            winNum = this.searchDiagonalDownLeft(board, lastMove, winNum, player)
        }
        if (winNum === 4) {
            return true
        }
    }

    Board.prototype.searchDiagonalUpLeft = function(board, move, winNum, player) {
        if (move[0] === 0 || move[1] === 0 || board[move[0] - 1][move[1] - 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] - 1, move[1] - 1]
            return this.searchDiagonalUpLeft(board, move, winNum, player)
        }
    }

    Board.prototype.searchDiagonalDownRight = function(board, move, winNum, player) {
        if (move[0] === 5 || move[1] === 6 || board[move[0] + 1][move[1] + 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] + 1, move[1] + 1]
            return this.searchDiagonalDownRight(board, move, winNum, player)
        }
    }

    Board.prototype.diagonalWinNegativeSlope = function(board, lastMove, player) {
        var winNum = 1
        winNum = this.searchDiagonalUpLeft(board, lastMove, winNum, player)
        if (winNum === 4) {
            return true
        } else {
            winNum = this.searchDiagonalDownRight(board, lastMove, winNum, player)
        }
        if (winNum === 4) {
            return true
        }
    }

    function Player(name, color, num) {
        this.name = name
        this.color = color
        this.num = num
    }

    function GamePlay() {
        this.playerRed = new Player('Red', 'red', 1)
        this.playerBlack = new Player('Black', 'black', 2)
        this.currentPlayer = this.playerRed
    }

    GamePlay.prototype.startGame = function() {
        var board = new Board(7, 6)
            // var currentPlayer = this.currentPlayer
        board.displayBoard(board.createBoard(), this.currentPlayer)
        $('div.selectionArea').replaceWith("<div class = 'topbox'><p>It's the classic match of <strong><span style='color: #b20000'> Red</span> v. Black</strong>. Find a friend, drop your pieces &amp; be the first to get four in a row!</p> <div class='button'> Get Started </div></div>")
        $('.button').click(function(event) {
            board.displayBoard(board.createBoard(), this.currentPlayer)
        }.bind(this))
        return board
    }

    GamePlay.prototype.playTurn = function(board, boardState, column, player) {
        var tup = board.whereToDrop(boardState, 5, column, player)
        boardState = tup[0]
        var lastMove = tup[1]
        board.displayBoard(boardState, this.whoIsPlayer())

        if (board.isWinner(boardState, lastMove, player.num)) {
            $('div.selectionArea').replaceWith("<div class='draw'><h2>" + player.name + " Wins!!! </h2><div class='button'>Play Again</div></div>")
            $('.button').click(function(event) {
                currentBoard = newGame.startGame()
                boardState = currentBoard.createBoard()
                state = [currentBoard, boardState]
                board.displayBoard(board.createBoard(), this.whoIsPlayer())
            }.bind(this))
        } else if (board.isDraw(boardState)) {
            $('div.selectionArea').replaceWith("<div class='draw'><h2>It's a draw!</h2><div class='button'>Play Again</div></div>")
            $('.button').click(function(event) {
                currentBoard = newGame.startGame()
                boardState = currentBoard.createBoard()
                state = [currentBoard, boardState]
                board.displayBoard(board.createBoard(), this.whoIsPlayer())
            }.bind(this))
        } else {
            return [board, boardState]
        }
    }

    GamePlay.prototype.whoIsPlayer = function() {
        if (this.currentPlayer === this.playerBlack) {
            this.currentPlayer = this.playerRed
        } else {
            this.currentPlayer = this.playerBlack
        }
        return this.currentPlayer
    }

    var newGame = new GamePlay()
    var currentBoard = newGame.startGame()
    var boardState = currentBoard.createBoard()
    var state = [currentBoard, boardState]
})