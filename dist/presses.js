'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.presses = presses;

var _most = require('most');

var _utils = require('./utils');

/* alternative "clicks" (ie mouseDown -> mouseUp ) implementation, with more fine
grained control*/
function basePresses(_ref, settings) {
  var mouseDowns$ = _ref.mouseDowns$,
      mouseUps$ = _ref.mouseUps$,
      mouseMoves$ = _ref.mouseMoves$,
      touchStarts$ = _ref.touchStarts$,
      touchEnds$ = _ref.touchEnds$,
      touchMoves$ = _ref.touchMoves$;

  touchMoves$ = touchMoves$.filter(function (t) {
    return t.touches.length === 1;
  });
  var maxStaticDeltaSqr = settings.maxStaticDeltaSqr;


  var starts$ = (0, _most.merge)(mouseDowns$, touchStarts$); // mouse & touch interactions starts
  var ends$ = (0, _most.merge)(mouseUps$, touchEnds$); // mouse & touch interactions ends
  var moves$ = (0, _most.merge)(mouseMoves$, touchMoves$);
  // only doing any "clicks if the time between mDOWN and mUP is below longpressDelay"
  // any small mouseMove is ignored (shaky hands)

  return starts$.timestamp().flatMap(function (downEvent) {
    return (0, _most.merge)((0, _most.just)(downEvent), moves$ // Skip if we get a movement before a mouse up
    //.tap(e => console.log('e.delta', JSON.stringify(e)))
    .filter(function (data) {
      return (0, _utils.isMoving)(data.delta, maxStaticDeltaSqr);
    }) // allow for small movement (shaky hands!) FIXME: implement
    .take(1).flatMap(function (x) {
      return (0, _most.empty)();
    }).timestamp(), ends$.take(1).timestamp());
  }).loop(function (acc, current) {
    var result = void 0;
    if (acc.length === 1) {
      var interval = current.time - acc[0].time;
      var moveDelta = [current.value.clientX - acc[0].value.offsetX, current.value.clientY - acc[0].value.offsetY]; // FIXME: duplicate of mouseDrags !
      moveDelta = moveDelta[0] * moveDelta[0] + moveDelta[1] * moveDelta[1]; // squared distance
      result = { value: current.value, interval: interval, moveDelta: moveDelta };
      acc = [];
    } else {
      acc.push(current);
    }
    return { seed: acc, value: result };
  }, []).filter(_utils.exists).multicast();
}

function presses(baseInteractions, settings) {
  var presses$ = basePresses(baseInteractions, settings);
  var longPressDelay = settings.longPressDelay,
      multiTapDelay = settings.multiTapDelay,
      maxStaticDeltaSqr = settings.maxStaticDeltaSqr;


  function bufferUntil(obsToBuffer, obsEnd) {
    return obsToBuffer.map(function (data) {
      return { type: 'data', data: data };
    }).merge(taps$.debounce(multiTapDelay).map(function (data) {
      return { type: 'reset' };
    })).loop(function (seed, _ref2) {
      var type = _ref2.type,
          data = _ref2.data;

      var value = void 0;
      if (type === 'data') {
        seed.push(data);
      } else {
        value = seed;
        seed = [];
      }
      return { seed: seed, value: value };
    }, []).filter(_utils.exists);

    /*const baseBuffer$ =
      obsToBuffer.scan(function (acc, current) {
        acc.push(current)
        return acc
    }, [])
     return baseBuffer$
      .until(obsEnd)*/
  }
  /*
  // exploring of more composition based system : much clearer, but needs work
   // Imagine map and filter are curried
  const mapc = curry2(map)
  const filterc = curry2(filter)
   const deltaBelowMax = x => x.moveDelta < maxStaticDeltaSqr
  const intervalBelowLongPress = x => x.interval <= longPressDelay
  const validButton = event => 'button' in event && event.button === 0
  const exists = x => x !== undefined
   const pluckValue = x => x.value
  const pluckList = x => x.list
  const first = x => x[0]
   const shortTaps = compose(
    filterc(deltaBelowMax),
    filterc(intervalBelowLongPress),
    mapc(pluckValue),
    filterc(validButton)
  )
   const firstInList = compose(
    mapc(pluckList),
    mapc(first)
  )
   //const tapsByNumber = tapCount => compose(filterc(x => x.nb === tapCount), firstInList())*/

  return presses$;
}