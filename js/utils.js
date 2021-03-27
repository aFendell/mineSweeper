// random int inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}


// // stop watch
// var minutesLabel = document.getElementById("minutes");
// var secondsLabel = document.getElementById("seconds");
// var totalSeconds = 0;

// function stopWatch() {
//   if (gIsGameON) {
//     setInterval(setTime, 1000);
//   }
//   console.log('Time on');
// }

// function setTime() {
//   ++totalSeconds;
//   secondsLabel.innerHTML = pad(totalSeconds % 60);
//   minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
// }

// function pad(val) {
//   var valString = val + "";
//   if (valString.length < 2) {
//     return "0" + valString;
//   } else {
//     return valString;
//   }
// }


// myStopWatch
var ss = document.querySelector('.stopwatch');


// [].forEach.call(ss, function (s) {
var currTimer = 0
var interval = 0
var lastUpdateTime = new Date().getTime
var elMins = document.querySelector('span.minutes')
var elSecs = document.querySelector('span.seconds')
var elCents = document.querySelector('span.centiseconds')

function pad(n) {
  return ('00' + n).substr(-2)
}

function update() {
  var now = new Date().getTime()
  var dt = now - lastUpdateTime

  currTimer += dt

  var time = new Date(currTimer)

  elMins.innerHTML = pad(time.getMinutes())
  elSecs.innerHTML = pad(time.getSeconds())
  elCents.innerHTML = pad(Math.floor(time.getMilliseconds() / 10))


  lastUpdateTime = now

}

function startTimer() {
  if (!interval) {
    lastUpdateTime = new Date().getTime()
    interval = setInterval(update, 1)
  }
}

function stopTimer() {
  clearInterval(interval)
  interval = 0
}

function resetTimer() {
  stopTimer()

  currTimer = 0

  elMins.innerHTML = elSecs.innerHTML = elCents.innerHTML = pad(0)
}

// })

