'use strict'
console.log('lets sweep some mines!');

const BANG = '💥'
const FLAG = '🚩'
const GOOD = '🙂'
const WIN = '😎'
const LOSE = '☹️'
const DEAD = '💀'

var gMinesCoord;
var isGameON = false
var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gCellsToFind = gLevel.SIZE ** 2

function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    var board = []


    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                i: i,
                j: j,
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell

            // if (i === gMinesCoord[0].i && j === gMinesCoord[0].j) board[i][j].isMine = true
            // if (i === gMinesCoord[1].i && j === gMinesCoord[1].j) board[i][j].isMine = true
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellId = `cell-${i}-${j}`
            strHTML += `<td id=${cellId} class="cell" onclick="cellClicked(this, ${i}, ${j})" 
                        oncontextmenu="cellFlaged(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j]
    if (currCell.isMarked) return

    gCellsToFind--

    if (!isGameON) {
        isGameON = true
        gMinesCoord = randLocateMines(i, j)
        setMinesNegsCount(gBoard)
        currCell.isShown = true
        if (currCell.minesAroundCount !== 0) {
            elCell.innerText = currCell.minesAroundCount
        }
    }

    elCell.classList.add("disabled")
    if (currCell.isMine) {
        for (var idx = 0; idx < gMinesCoord.length; idx++) {
            var currI = gMinesCoord[idx].i
            var currJ = gMinesCoord[idx].j
            var currMine = gBoard[currI][currJ]
            console.log('currMine location', currMine);
            currMine.isShown = true
            var elCell = document.querySelector(`#cell-${currI}-${currJ}`)
            elCell.innerText = BANG
        }
        gameOver()
    } else {
        currCell.isShown = true
        if (currCell.minesAroundCount !== 0) elCell.innerText = currCell.minesAroundCount
        // check Win
        if (gCellsToFind === 0) {
            // VICTORY
            victory()
        }
    }
}


function restart() {
    console.log('Restart');
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = countNegsMines(currCell)
        }
    }
}

function victory() {
    var elBtn = document.querySelector(".smiley")
    elBtn.innerText = WIN
    console.log('VICTORY');

    // stop time

    // check time vs high score
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

function randLocateMines(iStart, jStart) {
    var minesCoord = []
    var minesCount = gLevel.MINES
    while (minesCoord.length < minesCount) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        if (i === iStart && j === jStart) continue
        var currCoord = { i: i, j: j }
        if (!minesCoord.includes(currCoord)) {
            minesCoord.push(currCoord)
            gBoard[i][j].isMine = true
        }
    }
    return minesCoord
}

function cellFlaged(elCell, i, j) {
    var currCell = gBoard[i][j]
    currCell.oncontextmenu
    if (currCell.isMarked) {
        currCell.isMarked = false
        elCell.innerText = ''
    } else {
        currCell.isMarked = true
        elCell.innerText = FLAG
        // check win
        gCellsToFind--
        if (gCellsToFind === 0) {
            // VICTORY
            console.log('VICTORY');
            victory()
        }
    }
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault()
    }, false)
    console.log('gCellsToFind:', gCellsToFind);
}

function setLevel(elBtn) {
    if (elBtn.innerText === 'Beginner') {
        gLevel = {
            SIZE: 4,
            MINES: 2
        }
    } else if (elBtn.innerText === 'Medium') {
        gLevel = {
            SIZE: 8,
            MINES: 12
        }
    } else {
        gLevel = {
            SIZE: 12,
            MINES: 30
        }
    }

    gBoard = buildBoard()
    renderBoard(gBoard)
    gCellsToFind = gLevel.SIZE ** 2
}

function gameOver() {
    var elBtn = document.querySelector(".smiley")
    elBtn.innerText = DEAD

    // problem inserting innerHTML
    // var strHTML = 'onclick="restart()"'
    // elBtn.innerHTML += strHTML

    // for (var i = 0; i < gBoard.length; i++){
    //     for (var j = 0; j < gBoard[0].length ; j++){

    //     }
    // }    
}