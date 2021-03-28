'use strict'
console.log('lets sweep some mines!');

const BANG = '💥'
const FLAG = '🚩'
const GOOD = '🙂'
const WIN = '😎'
const LOSE = '☹️'
const DEAD = '💀'

var gMinesCoord;
var gIsGameON = false
var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gCellsToFind = gLevel.SIZE ** 2
var gBestTime = 'x'

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
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            // var currCell = board[i][j]
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

    if (!gIsGameON) {
        // Start Game
        gIsGameON = true
        // Start Time
        startTimer()
        gMinesCoord = randLocateMines(i, j)
        console.log('Mines locations:', gMinesCoord);
        setMinesNegsCount(gBoard)
    }

    currCell.isShown = true
    gCellsToFind--
    elCell.classList.add("disabled")

    if (currCell.isMine) {
        for (var i = 0; i < gMinesCoord.length; i++) {
            var idxI = gMinesCoord[i][0]
            var idxJ = gMinesCoord[i][1]
            var currMine = gBoard[idxI][idxJ]
            currMine.isShown = true
            console.log('currMine location', currMine);
            var elCell = document.querySelector(`#cell-${idxI}-${idxJ}`)
            elCell.innerText = BANG
        }
        endGame('Game Over')

    } else {
        if (currCell.minesAroundCount === 0) {
            for (var idxI = i - 1; idxI <= i + 1; idxI++) {
                if (idxI < 0 || idxI >= gLevel.SIZE) continue
                for (var idxJ = j - 1; idxJ <= j + 1; idxJ++) {
                    if (idxJ < 0 || idxJ >= gLevel.SIZE) continue
                    if (idxI === i && idxJ === j) continue
                    var currNeg = gBoard[idxI][idxJ]
                    currNeg.isShown = true
                    console.log('currNeg:', currNeg);
                    gCellsToFind--
                    console.log('gCellsToFind:', gCellsToFind);
                    var elNeg = document.querySelector(`#cell-${idxI}-${idxJ}`)
                    elNeg.classList.add("disabled")
                    if (currNeg.minesAroundCount !== 0) {
                        elNeg.innerText = currNeg.minesAroundCount
                    }
                }
            }
        } else {
            elCell.innerText = currCell.minesAroundCount
        }
    }

    // check Win
    if (gCellsToFind <= 0) endGame('Victory')
}

function restart() {
    console.log('Restart');
    var elBtn = document.querySelector(".smiley")
    elBtn.innerText = GOOD

    // Reset time
    resetTimer()

    gLevel = {
        SIZE: 4,
        MINES: 2
    }

    gCellsToFind = gLevel.SIZE ** 2

    init()
}

function endGame(status) {
    gIsGameON = false

    // Stop time
    var finishTime = stopTimer()

    // change face and add restart
    var elBtn = document.querySelector(".smiley")
    elBtn.setAttribute("onclick", "restart()")

    if (status === 'Game Over') {
        elBtn.innerText = DEAD
        console.log('Game Over!');

    } else if (status === 'Victory') {
        // check time vs high score
        elBtn.innerText = WIN
        console.log('VICTORY');
        isBestTime(finishTime)
        console.log('Best gBestTime:', gBestTime)
    }
    // Disable all cells
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].isShown = true
            var currElCell = document.querySelector(`#cell-${i}-${j}`)
            currElCell.classList.add("disabled")
        }
    }
}

function isBestTime(time) {
    var elSpan = document.querySelector('.high-score span')

    if (gBestTime === 'x') {
        gBestTime = time
        elSpan.innerText = gBestTime
    } else {
        var bestTime = new Date('December 01, 2021 ' + gBestTime)
        var finishTime = new Date('December 01, 2021 ' + time)
        if (finishTime.getTime() < bestTime.getTime()) {
            gBestTime = time
            elSpan.innerText = gBestTime
        }
    }
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

function randLocateMines(iStart, jStart) {
    var minesCoord = []
    var minesCount = gLevel.MINES
    while (minesCoord.length < minesCount) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        if (i === iStart && j === jStart) continue
        var currCoord = [i, j]
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
        gCellsToFind++
    } else {
        currCell.isMarked = true
        elCell.innerText = FLAG
        // check win
        gCellsToFind--
        if (gCellsToFind === 0) {
            // VICTORY
            endGame('Victory')
        }
    }
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault()
    }, false)
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

