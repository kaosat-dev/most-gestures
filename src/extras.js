import { exists } from './utils'

export function shortTaps (taps$, settings) {
  const {longPressDelay, maxStaticDeltaSqr} = settings
  const shortTaps$ = taps$
    .filter(e => e.interval <= longPressDelay) // any tap shorter than this time is a short one
    .filter(e => e.moveDelta < maxStaticDeltaSqr) // when the square distance is bigger than this, it is a movement, not a tap
    .map(e => e.value)
    .filter(event => ('button' in event && event.button === 0)) // FIXME : bad filter , excludes mobile ?!

    .map(data => ({type: 'data', data}))
    .merge(taps$.debounce(multiClickDelay).map(data => ({type: 'reset'})))
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
    // .buffer(function () { return taps$.debounce(multiClickDelay) })// buffer all inputs, and emit at then end of multiClickDelay
    .map(list => ({list: list, nb: list.length}))
    .multicast()

  return shortTaps
}
