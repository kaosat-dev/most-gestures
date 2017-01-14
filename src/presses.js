import { just, merge, empty } from 'most'
import { exists } from './utils'
/* alternative "clicks" (ie mouseDown -> mouseUp ) implementation, with more fine
grained control*/
function basePresses ({mouseDowns$, mouseUps$, mouseMoves$, touchStarts$, touchEnds$, touchMoves$}, settings) {
  touchMoves$ = touchMoves$.filter(t => t.touches.length === 1)
  const {maxStaticDeltaSqr} = settings

  const starts$ = merge(mouseDowns$, touchStarts$) // mouse & touch interactions starts
  const ends$ = merge(mouseUps$, touchEnds$) // mouse & touch interactions ends
  const moves$ = merge(mouseMoves$, touchMoves$)
  // only doing any "clicks if the time between mDOWN and mUP is below longpressDelay"
  // any small mouseMove is ignored (shaky hands)

  return starts$
    .timestamp()
    .flatMap(function (downEvent) {
      return merge(
        just(downEvent),
        moves$ // Skip if we get a movement before a mouse up
          //.tap(e => console.log('e.delta', JSON.stringify(e)))
          .filter(data => isMoving(data.delta, maxStaticDeltaSqr)) // allow for small movement (shaky hands!) FIXME: implement
          .take(1).flatMap(x => empty()).timestamp(),
        ends$.take(1).timestamp()
      )
    })
    .loop(function (acc, current) {
      let result
      if (acc.length === 1) {
        const interval = current.time - acc[0].time
        let moveDelta = [current.value.clientX - acc[0].value.offsetX, current.value.clientY - acc[0].value.offsetY] // FIXME: duplicate of mouseDrags !
        moveDelta = moveDelta[0] * moveDelta[0] + moveDelta[1] * moveDelta[1] // squared distance
        result = {value: current.value, interval, moveDelta}
        acc = []
      } else {
        acc.push(current)
      }
      return {seed: acc, value: result}
    }, [])
    .filter(exists)
    .multicast()
}

export function presses (baseInteractions, settings) {
  const presses$ = basePresses(baseInteractions, settings)
  const {longPressDelay, multiTapDelay, maxStaticDeltaSqr} = settings

  function bufferUntil (obsToBuffer, obsEnd) {
    return obsToBuffer
      .map(data => ({type: 'data', data}))
      .merge(taps$.debounce(multiTapDelay).map(data => ({type: 'reset'})))
      .loop(function (seed, {type, data}) {
        let value
        if (type === 'data') {
          seed.push(data)
        } else {
          value = seed
          seed = []
        }
        return {seed, value}
      }, [])
      .filter(exists)

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

  return presses$
}
