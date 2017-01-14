'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taps = taps;

var _utils = require('./utils');

function taps(presses$, settings) {
  var longPressDelay = settings.longPressDelay,
      maxStaticDeltaSqr = settings.maxStaticDeltaSqr,
      multiTapDelay = settings.multiTapDelay;

  var taps$ = presses$.filter(function (e) {
    return e.interval <= longPressDelay;
  }) // any tap shorter than this time is a short one
  .filter(function (e) {
    return e.moveDelta < maxStaticDeltaSqr;
  }) // when the square distance is bigger than this, it is a movement, not a tap
  .map(function (e) {
    return e.value;
  })
  //.filter(event => ('button' in event && event.button === 0)) // FIXME : bad filter , excludes mobile ?!
  .map(function (data) {
    return { type: 'data', data: data };
  }).merge(presses$.debounce(multiTapDelay).map(function (data) {
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
  }, []).filter(_utils.exists)
  // .buffer(function () { return taps$.debounce(multiTapDelay) })// buffer all inputs, and emit at then end of multiTapDelay
  .map(function (list) {
    return { list: list, nb: list.length };
  }).multicast();

  return taps$;
}