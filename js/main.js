'use strict'
console.log('lets sweep some mines!');

const BANG = '💥'
var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
}

function buildBoard() {
    var board = []
    var minesCoord = randLocateMines()
    // console.log('mines loctions:', minesCoord);
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                i: i,
                j: j,
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            board[i][j] = cell

            if (i === minesCoord[0].i && j === minesCoord[0].j) board[i][j].isMine = true
            if (i === minesCoord[1].i && j === minesCoord[1].j) board[i][j].isMine = true
        }
    }

    console.table(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellId = `cell-${i}-${j}`
            strHTML += `<td id=${cellId} class="cell" onclick="cellClicked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = countNegsMines(currCell)
        }
    }
}


function countNegsMines(cell) {
    var negsMineCount = 0
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue
            if (i === cell.i && j === cell.j) continue
            if (gBoard[i][j].isMine) negsMineCount++
        }
    }
    return negsMineCount
}

function cellClicked(elCell, i, j) {
    console.log('cell ' + i + ',' + j + ' is clicked');
    var currCell = gBoard[i][j]
    if (currCell.isMine) {
        currCell.isShown = true
        elCell.innerText = BANG
    } else {
        currCell.isShown = true
        elCell.innerText = currCell.minesAroundCount
    }
}

function randLocateMines() {
    var minesCoord = []
    var minesCount = gLevel.MINES
    // console.log('Number of mines:', minesCount);
    // console.log('minesCoord.length:', minesCoord.length);
    while (minesCoord.length < minesCount) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        var currCoord = { i: i, j: j }
        if (!minesCoord.includes(currCoord)) minesCoord.push(currCoord)
    }
    return minesCoord
}