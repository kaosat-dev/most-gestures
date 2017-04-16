'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taps = taps;

var _utils = require('./utils');

/**
 * tap on screen , either via gestures or clicks,
 * IF the movement was short (settable)
 * AND there was little movement only (settable)
 * @param  {Number} longPressDelay any tap shorter than this time is a short one
 * @param  {Number} maxStaticDeltaSqr  when the square distance is bigger than this, it is a movement, not a tap
 * @param  {Number} multiTapDelay  delay between taps for multi tap detection
 */
function taps(presses$, settings) {
  var longPressDelay = settings.longPressDelay,
      maxStaticDeltaSqr = settings.maxStaticDeltaSqr,
      multiTapDelay = settings.multiTapDelay;

  var taps$ = presses$.filter(function (e) {
    return e.timeDelta <= longPressDelay;
  }) // any tap shorter than this time is a short one
  .filter(function (e) {
    return e.moveDelta.sqrd < maxStaticDeltaSqr;
  }) // when the square distance is bigger than this, it is a movement, not a tap
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