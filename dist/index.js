'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseInteractionsFromEvents = baseInteractionsFromEvents;
exports.pointerGestures = pointerGestures;

var _most = require('most');

var _utils = require('./utils');

var _presses = require('./presses');

var _taps = require('./taps');

var _drags = require('./drags');

var _zooms = require('./zooms');

function baseInteractionsFromEvents(targetEl, options) {
  var defaults = {
    preventScroll: true
  };
  options = Object.assign({}, defaults, options);

  var mouseDowns$ = (0, _most.fromEvent)('mousedown', targetEl);
  var mouseUps$ = (0, _most.fromEvent)('mouseup', targetEl);
  // const mouseLeaves$ = fromEvent('mouseleave', targetEl).merge(fromEvent('mouseout', targetEl))
  var mouseMoves$ = (0, _most.fromEvent)('mousemove', targetEl); // .takeUntil(mouseLeaves$) // altMouseMoves(fromEvent(targetEl, 'mousemove')).takeUntil(mouseLeaves$)
  var rightClicks$ = (0, _most.fromEvent)('contextmenu', targetEl).tap(_utils.preventDefault); // disable the context menu / right click

  var touchStarts$ = (0, _most.fromEvent)('touchstart', targetEl);
  var touchMoves$ = (0, _most.fromEvent)('touchmove', targetEl);
  var touchEnds$ = (0, _most.fromEvent)('touchend', targetEl);

  // const gestureChange$ = fromEvent('gesturechange', targetEl)
  // const gestureStart$ = fromEvent('gesturestart', targetEl)
  // const gestureEnd$ = fromEvent('gestureend', targetEl)

  var pointerDowns$ = (0, _most.merge)(mouseDowns$, touchStarts$); // mouse & touch interactions starts
  var pointerUps$ = (0, _most.merge)(mouseUps$, touchEnds$); // mouse & touch interactions ends
  var pointerMoves$ = (0, _most.merge)(mouseMoves$, touchMoves$.filter(function (t) {
    return t.touches.length === 1;
  }));

  function preventScroll(targetEl) {
    (0, _most.fromEvent)('mousewheel', targetEl).forEach(_utils.preventDefault);
    (0, _most.fromEvent)('DOMMouseScroll', targetEl).forEach(_utils.preventDefault);
    (0, _most.fromEvent)('wheel', targetEl).forEach(_utils.preventDefault);
    (0, _most.fromEvent)('touchmove', targetEl).forEach(_utils.preventDefault);
  }

  if (options.preventScroll) {
    preventScroll(targetEl);
  }

  var wheel$ = (0, _most.merge)((0, _most.fromEvent)('wheel', targetEl), (0, _most.fromEvent)('DOMMouseScroll', targetEl), (0, _most.fromEvent)('mousewheel', targetEl)).map(_utils.normalizeWheel);

  return {
    mouseDowns$: mouseDowns$,
    mouseUps$: mouseUps$,
    mouseMoves$: mouseMoves$,

    rightClicks$: rightClicks$,
    wheel$: wheel$,

    touchStarts$: touchStarts$,
    touchMoves$: touchMoves$,
    touchEnds$: touchEnds$,

    pointerDowns$: pointerDowns$,
    pointerUps$: pointerUps$,
    pointerMoves$: pointerMoves$ };
}

function pointerGestures(baseInteractions, options) {
  var defaults = {
    multiTapDelay: 250, // delay between clicks/taps
    longPressDelay: 250, // delay after which we have a 'hold'
    maxStaticDeltaSqr: 100, // maximum delta (in pixels squared) above which we are not static
    zoomMultiplier: 200, // zoomFactor for normalized interactions across browsers
    pinchThreshold: 4000, // The minimum amount in pixels the inputs must move until it is fired.
    pixelRatio: typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1
  };
  var settings = Object.assign({}, defaults, options);

  var press$ = (0, _presses.presses)(baseInteractions, settings);
  var holds$ = press$ // longTaps/holds: either HELD leftmouse/pointer or HELD right click
  .filter(function (e) {
    return e.timeDelta > settings.longPressDelay;
  }).filter(function (e) {
    return e.moveDelta.sqrd < settings.maxStaticDeltaSqr;
  }); // when the square distance is bigger than this, it is a movement, not a tap
  //.map(e => e.value)
  var taps$ = (0, _taps.taps)(press$, settings);
  var drags$ = (0, _drags.drags)(baseInteractions, settings);
  var zooms$ = (0, _zooms.zooms)(baseInteractions, settings);

  //FIXME: use 'press' as higher level above tap & click

  return {
    press: press$,
    holds: holds$,
    taps: taps$,
    drags: drags$,
    zooms: zooms$
  };
}