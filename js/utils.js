// random int inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

// myStopWatch
var ss = document.querySelector('.stopwatch');

// [].forEach.call(ss, function (s) {
var gCurrTimer = 0
var gInterval = 0
var gLastUpdateTime = new Date().getTime
var elMins = document.querySelector('span.minutes')
var elSecs = document.querySelector('span.seconds')
var elCents = document.querySelector('span.centiseconds')

function pad(n) {
  return ('00' + n).substr(-2)
}

function update() {
  var now = new Date().getTime()
  var dt = now - gLastUpdateTime

  gCurrTimer += dt

  var time = new Date(gCurrTimer)

  elMins.innerHTML = pad(time.getMinutes())
  elSecs.innerHTML = pad(time.getSeconds())
  elCents.innerHTML = pad(Math.floor(time.getMilliseconds() / 10))

  gLastUpdateTime = now
}

function startTimer() {
  if (!gInterval) {
    gLastUpdateTime = new Date().getTime()
    gInterval = setInterval(update, 1)
  }
}

function stopTimer() {
  clearInterval(gInterval)
  gInterval = 0

  var strFinishTime = elMins.innerHTML + ':' + elSecs.innerHTML + ':' + elCents.innerHTML

  return(strFinishTime)
}

function resetTimer() {
  stopTimer()

  gCurrTimer = 0

  elMins.innerHTML = elSecs.innerHTML = elCents.innerHTML = pad(0)
}
