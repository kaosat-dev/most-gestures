import { empty, continueWith } from 'most'

// for most.js
export const repeat = (n, stream) => n === 0 ? empty()
  : n === 1 ? stream
    : continueWith(() => repeat(n - 1, stream), stream)

// see https://github.com/cujojs/most/issues/20

// this is in another package/module normally
export function preventDefault (event) {
  event.preventDefault()
  return event
}

// for gesture vs touch events
export function isNotIos (event) {
  const ios = /iphone|ipod|ipad/.test(window.navigator.userAgent.toLowerCase())
  return ios === false
}

export function isMoving (moveDelta, deltaSqr) {
  return true
/* let distSqr = (moveDelta.x * moveDelta.x + moveDelta.y * moveDelta.y)
let isMoving = (distSqr > deltaSqr)
// console.log("moving",isMoving)
return isMoving*/
}

export function normalizeWheel (event) {
  let delta = {x: 0, y: 0}
  if (event.wheelDelta) { // WebKit / Opera / Explorer 9
    delta = event.wheelDelta
  } else if (event.detail) { // Firefox older
    delta = -event.detail
  }else if (event.deltaY) { // Firefox
    delta = -event.deltaY
  }
  delta = delta >= 0 ? 1 : -1
  return delta
}
