'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pinchZooms_old = pinchZooms_old;
exports.pinchZooms = pinchZooms;
exports.zooms = zooms;

var _most = require('most');

// this one is not reliable enough
function pinchZooms_old(gestureChange$, gestureStart$, gestureEnd$) {
  return gestureStart$.flatMap(function (gs) {
    return gestureChange$.map(function (x) {
      return x.scale;
    })
    // .loop((prev, cur) => ({seed: cur, value: prev ? cur - prev : prev}), undefined)
    .loop(function (prev, cur) {
      console.log('prev', prev, 'cur', cur, 'value', prev ? cur - prev : prev);
      var value = prev ? cur - prev : prev;

      if (value > 0) {
        value = Math.min(Math.max(value, 0), 2);
      } else {
        value = Math.min(Math.max(value, 2), 0);
      }

      return { seed: cur, value: value };
    }, undefined).filter(function (x) {
      return x !== undefined;
    })
    // .map(x => x / x)
    .takeUntil(gestureEnd$);
  }).tap(function (e) {
    return console.log('pinchZooms', e);
  });
}

function pinchZooms(_ref, settings) {
  var touchStarts$ = _ref.touchStarts$,
      touchMoves$ = _ref.touchMoves$,
      touchEnds$ = _ref.touchEnds$;
  var pixelRatio = settings.pixelRatio,
      pinchThreshold = settings.pinchThreshold;
  // generic custom gesture handling
  // very very vaguely based on http://stackoverflow.com/questions/11183174/simplest-way-to-detect-a-pinch

  return touchStarts$.filter(function (t) {
    return t.touches.length === 2;
  }).flatMap(function (ts) {
    var startX1 = ts.touches[0].pageX * pixelRatio;
    var startY1 = ts.touches[0].pageY * pixelRatio;

    var startX2 = ts.touches[1].pageX * pixelRatio;
    var startY2 = ts.touches[1].pageY * pixelRatio;

    var startDist = (startX1 - startX2) * (startX1 - startX2) + (startY1 - startY2) * (startY1 - startY2);

    return touchMoves$.tap(function (e) {
      return e.preventDefault();
    }).filter(function (t) {
      return t.touches.length === 2;
    }).map(function (e) {
      var curX1 = e.touches[0].pageX * pixelRatio;
      var curY1 = e.touches[0].pageY * pixelRatio;

      var curX2 = e.touches[1].pageX * pixelRatio;
      var curY2 = e.touches[1].pageY * pixelRatio;

      var currentDist = (curX1 - curX2) * (curX1 - curX2) + (curY1 - curY2) * (curY1 - curY2);
      return currentDist;
    }).loop(function (prev, cur) {
      if (prev) {
        if (Math.abs(cur - prev) < pinchThreshold) {
          return { seed: cur, value: undefined };
        }
        return { seed: cur, value: cur - prev };
      }
      return { seed: cur, value: cur - startDist };
    }, undefined).filter(function (x) {
      return x !== undefined;
    }).map(function (x) {
      return x * 0.000003;
    }) // arbitrary, in order to harmonise desktop /mobile up to a point
    /* .map(function (e) {
      const scale = e > 0 ? Math.sqrt(e) : -Math.sqrt(Math.abs(e))
      return scale
    })*/
    .takeUntil(touchEnds$);
  });
}

function zooms(_ref2, settings) {
  var touchStarts$ = _ref2.touchStarts$,
      touchMoves$ = _ref2.touchMoves$,
      touchEnds$ = _ref2.touchEnds$,
      wheel$ = _ref2.wheel$;

  var zooms$ = (0, _most.merge)(pinchZooms({ touchStarts$: touchStarts$, touchMoves$: touchMoves$, touchEnds$: touchEnds$ }, settings), // for Android (no gestureXX events)
  wheel$).map(function (x) {
    return x * settings.zoomMultiplier;
  });
  return zooms$;
}