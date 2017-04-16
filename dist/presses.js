'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.presses = presses;

var _most = require('most');

var _utils = require('./utils');

/* alternative "clicks" (ie mouseDown -> mouseUp ) implementation, with more fine
grained control
*/
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

  var starts$ = (0, _most.merge)(mouseDowns$, touchStarts$); // mouse & touch interactions starts
  var ends$ = (0, _most.merge)(mouseUps$, touchEnds$); // mouse & touch interactions ends
  var moves$ = (0, _most.merge)(mouseMoves$, touchMoves$);
  // only doing any "clicks if the time between mDOWN and mUP is below longpressDelay"
  // any small mouseMove is ignored (shaky hands)

  return starts$.timestamp().flatMap(function (downEvent) {
    return (0, _most.merge)((0, _most.just)(downEvent),
    //moves$.take(1).flatMap(x => empty()).timestamp(), // Skip if we get a movement before a mouse up
    ends$.take(1).timestamp());
  }).loop(function (acc, current) {
    var result = void 0;
    if (acc.length === 1) {
      var timeDelta = current.time - acc[0].time;

      var curX = 'touches' in current.value ? current.value.changedTouches[0].pageX : current.value.pageX; //* pixelRatio
      var curY = 'touches' in current.value ? current.value.changedTouches[0].pageY : current.value.pageY; //* pixelRatio

      var prevX = 'touches' in acc[0].value ? acc[0].value.touches[0].pageX : acc[0].value.pageX;
      var prevY = 'touches' in acc[0].value ? acc[0].value.touches[0].pageY : acc[0].value.pageY;

      var delta = [curX - prevX, curY - prevY]; // FIXME: duplicate of mouseDrags !
      delta = delta[0] * delta[0] + delta[1] * delta[1]; // squared distance
      var moveDelta = {
        x: prevX - curX,
        y: curY - prevY,
        sqrd: delta
      };

      result = { value: current.value, originalEvent: current.value, timeDelta: timeDelta, moveDelta: moveDelta, x: curX, y: curY };
      acc = [];
    } else {
      acc.push(current);
    }
    return { seed: acc, value: result };
  }, []).filter(_utils.exists).filter(function (x) {
    return x.value !== undefined;
  }).multicast();
}

function presses(baseInteractions, settings) {
  var presses$ = basePresses(baseInteractions, settings);

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
   //const tapsByNumber = tapCount => compose(filterc(x => x.nb === tapCount), firstInList()) */

  return presses$;
}