'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mouseDrags = mouseDrags;
exports.touchDrags = touchDrags;
exports.drags = drags;

var _most = require('most');

// based on http://jsfiddle.net/mattpodwysocki/pfCqq/
function mouseDrags(mouseDowns$, mouseUps, mouseMoves, settings) {
  var pixelRatio = settings.pixelRatio;

  return mouseDowns$.flatMap(function (md) {
    // calculate offsets when mouse down
    var startX = md.offsetX * pixelRatio;
    var startY = md.offsetY * pixelRatio;
    // Calculate delta with mousemove until mouseup
    var prevX = startX;
    var prevY = startY;

    return mouseMoves.map(function (e) {
      var curX = e.clientX * pixelRatio;
      var curY = e.clientY * pixelRatio;

      var delta = {
        left: curX - startX,
        top: curY - startY,
        x: prevX - curX,
        y: curY - prevY
      };

      prevX = curX;
      prevY = curY;

      var normalized = { x: curX, y: curY };
      return { originalEvents: [e], delta: delta, normalized: normalized, type: 'mouse' };
    }).takeUntil(mouseUps);
  });
}

function touchDrags(touchStarts$, touchEnds$, touchMoves$, settings) {
  var pixelRatio = settings.pixelRatio;

  return touchStarts$.flatMap(function (e) {
    var startX = e.touches[0].pageX * pixelRatio;
    var startY = e.touches[0].pageY * pixelRatio;

    var prevX = startX;
    var prevY = startY;

    return touchMoves$.map(function (e) {
      var curX = e.touches[0].pageX * pixelRatio;
      var curY = e.touches[0].pageY * pixelRatio;

      var delta = {
        left: curX - startX,
        top: curY - startY,
        x: prevX - curX,
        y: curY - prevY
      };

      prevX = curX;
      prevY = curY;

      var normalized = { x: curX, y: curY };
      return { originalEvents: [e], delta: delta, normalized: normalized, type: 'touch' };
    }).takeUntil(touchEnds$);
  });
}

/* drag move interactions press & move(continuously firing)
*/
function drags(_ref, settings) {
  var mouseDowns$ = _ref.mouseDowns$,
      mouseUps$ = _ref.mouseUps$,
      mouseMoves$ = _ref.mouseMoves$,
      touchStarts$ = _ref.touchStarts$,
      touchEnds$ = _ref.touchEnds$,
      longTaps$ = _ref.longTaps$,
      touchMoves$ = _ref.touchMoves$;

  touchMoves$ = touchMoves$.filter(function (t) {
    return t.touches.length === 1;
  });
  var drags$ = (0, _most.merge)(mouseDrags(mouseDowns$, mouseUps$, mouseMoves$, settings), touchDrags(touchStarts$, touchEnds$, touchMoves$, settings));
  // .merge(merge(touchEnds$, mouseUps$).map(undefined))
  // .tap(e=>console.log('dragMoves',e))

  // .takeUntil(longTaps$) // .repeat() // no drag moves if there is a context action already taking place

  return drags$;
}