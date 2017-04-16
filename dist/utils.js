'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repeat = undefined;
exports.preventDefault = preventDefault;
exports.isMoving = isMoving;
exports.normalizeWheel = normalizeWheel;
exports.exists = exists;

var _most = require('most');

// for most.js
var repeat = exports.repeat = function repeat(n, stream) {
  return n === 0 ? (0, _most.empty)() : n === 1 ? stream : (0, _most.continueWith)(function () {
    return repeat(n - 1, stream);
  }, stream);
};

// see https://github.com/cujojs/most/issues/20

// this is in another package/module normally
function preventDefault(event) {
  event.preventDefault();
  return event;
}

/* determine if distance was 'enough' to consider it a ...movement*/
function isMoving(moveDelta, deltaSqr) {
  return true;
  /* let distSqr = (moveDelta.x * moveDelta.x + moveDelta.y * moveDelta.y)
  let isMoving = (distSqr > deltaSqr)
  // console.log("moving",isMoving)
  return isMoving*/
}

function normalizeWheel(event) {
  var delta = { x: 0, y: 0 };
  if (event.wheelDelta) {
    // WebKit / Opera / Explorer 9
    delta = event.wheelDelta;
  } else if (event.detail) {
    // Firefox older
    delta = -event.detail;
  } else if (event.deltaY) {
    // Firefox
    delta = -event.deltaY;
  }
  delta = delta >= 0 ? 1 : -1;
  return delta;
}

function exists(data) {
  return data !== null && data !== undefined;
}

function bufferUntil(obsToBuffer, obsEnd) {
  return obsToBuffer.map(function (data) {
    return { type: 'data', data: data };
  }).merge(taps$.debounce(multiTapDelay).map(function (data) {
    return { type: 'reset' };
  })).loop(function (seed, _ref) {
    var type = _ref.type,
        data = _ref.data;

    var value = void 0;
    if (type === 'data') {
      seed.push(data);
    } else {
      value = seed;
      seed = [];
    }
    return { seed: seed, value: value };
  }, []).filter(exists);

  /* const baseBuffer$ =
    obsToBuffer.scan(function (acc, current) {
      acc.push(current)
      return acc
  }, [])
  
  return baseBuffer$
    .until(obsEnd) */
}