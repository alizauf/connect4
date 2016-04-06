// Test to make sure the board is being created correctly as an array of arrays
QUnit.test('creating board', function(assert) {
    var testBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    var createBoard = function(height, width) {
        var board = []
        for (var i = 0; i < height; i++) {
            var row = []
            board.push(row)
            for (var j = 0; j < width; j++) {
                board[i].push(0)
            }
        }
        return board
    }
    assert.equal(JSON.stringify(testBoard), JSON.stringify(createBoard(6, 7)), 'Board creation test')
})

// Test to make sure it is dropping the piece in the right place
QUnit.test('dropping in the right spot', function(assert) {
    var emptyBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    var oneMoveBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0]
    ]
    var twoMoveBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0]
    ]
    var whereToDrop = function(board, count, column, playerNum) {
        if (board[count][column] === 0) {
            board[count][column] = playerNum
            var lastMove = [count, parseInt(column)]
            return [board, lastMove]
        } else {
            count -= 1
            return whereToDrop(board, count, column, playerNum)
        }
    }
    assert.equal(JSON.stringify([oneMoveBoard, [5, 5]]), JSON.stringify(whereToDrop(emptyBoard, 5, 5, 1), 'Empty board drop ok'))

    assert.equal(JSON.stringify([twoMoveBoard, [4, 5]]), JSON.stringify(whereToDrop(oneMoveBoard, 5, 5, 1), 'One board drop ok'))
})

QUnit.test('horizontal win search', function(assert) {
    var emptyBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    var oneMoveBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0]
    ]

    var searchHorizontalLeft = function(board, move, winNum, player) {
        if (move[1] === 0 || board[move[0]][move[1] - 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0], move[1] - 1]
            return searchHorizontalLeft(board, move, winNum, player)
        }
    }
    assert.equal(1, searchHorizontalLeft(emptyBoard, [5, 0], 1, 1), 'No horizontal win potential found')
    assert.equal(2, searchHorizontalLeft(oneMoveBoard, [5, 6], 1, 1), 'Some horizontal win potential found')
})

QUnit.test('vertical win search', function(assert) {
    var emptyBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    var oneMoveBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0]
    ]

    var searchVertical = function(board, move, winNum, player) {
        if (move[0] === 5 || board[move[0] + 1][move[1]] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] + 1, move[1]]
            return searchVertical(board, move, winNum, player)
        }
    }
    assert.equal(1, searchVertical(emptyBoard, [5, 0], 1, 1), 'No vertical win potential found')
    assert.equal(2, searchVertical(oneMoveBoard, [4, 5], 1, 1), 'Some vertical win potential found')
})

QUnit.test('diagonal win search', function(assert) {
    var emptyBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    var oneMoveBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1]
    ]

    var searchDiagonalUpRight = function(board, move, winNum, player) {
        if (move[0] === 0 || move[1] === 6 || board[move[0] - 1][move[1] + 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0] - 1, move[1] + 1]
            return searchDiagonalUpRight(board, move, winNum, player)
        }
    }
    assert.equal(1, searchDiagonalUpRight(emptyBoard, [5, 0], 1, 1), 'No diagonal win potential found')
    assert.equal(2, searchDiagonalUpRight(oneMoveBoard, [5, 5], 1, 1), 'Some diagonal win potential found')
})

QUnit.test('if 4 we have a winner', function(assert) {
    var emptyBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    var winBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 1, 0]
    ]

    var searchHorizontalLeft = function(board, move, winNum, player) {
        if (move[1] === 0 || board[move[0]][move[1] - 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0], move[1] - 1]
            return searchHorizontalLeft(board, move, winNum, player)
        }
    }

    var searchHorizontalRight = function(board, move, winNum, player) {
        if (move[1] === 6 || board[move[0]][move[1] + 1] !== player) {
            return winNum
        } else {
            winNum++
            move = [move[0], move[1] + 1]
            return searchHorizontalRight(board, move, winNum, player)
        }
    }

    var horizontalWin = function(board, lastMove, player) {
        var winNum = 1
        winNum = searchHorizontalLeft(board, lastMove, winNum, player)
        if (winNum === 4) {
            return true
        } else {
            winNum = searchHorizontalRight(board, lastMove, winNum, player)
        }
        if (winNum === 4) {
            return true
        }
    }

    assert.notOk(horizontalWin(emptyBoard, [5, 0], 1), 'No horizontal win num')
    assert.ok(horizontalWin(winBoard, [5, 3], 1), 'Find horizontal win')
})

QUnit.test('switch player', function(assert) {
    var playerRed = 1
    var playerBlack = 2
    var currentPlayer = playerBlack
    var whoIsPlayer = function() {
        if (currentPlayer === playerBlack) {
            currentPlayer = playerRed
        } else {
            currentPlayer = playerBlack
        }
        return currentPlayer
    }
    assert.equal(1, whoIsPlayer(), 'Player switches properly')

})