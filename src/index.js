import { fromEvent, merge } from 'most'
import { normalizeWheel, preventDefault } from './utils'
import { taps } from './taps'
import { drags } from './drags'
import { zooms } from './zooms'

export function baseInteractionsFromEvents (targetEl, options) {
  const defaults = {
    preventScroll: true
  }
  options = Object.assign({}, defaults, options)

  const mouseDowns$ = fromEvent('mousedown', targetEl)
  const mouseUps$ = fromEvent('mouseup', targetEl)
  // const mouseLeaves$ = fromEvent('mouseleave', targetEl).merge(fromEvent('mouseout', targetEl))
  const mouseMoves$ = fromEvent('mousemove', targetEl) // .takeUntil(mouseLeaves$) // altMouseMoves(fromEvent(targetEl, 'mousemove')).takeUntil(mouseLeaves$)
  const rightClicks$ = fromEvent('contextmenu', targetEl).tap(preventDefault) // disable the context menu / right click

  const touchStarts$ = fromEvent('touchstart', targetEl)
  const touchMoves$ = fromEvent('touchmove', targetEl).filter(t => t.touches.length === 1)
  const touchEnds$ = fromEvent('touchend', targetEl)

  // const gestureChange$ = fromEvent('gesturechange', targetEl)
  // const gestureStart$ = fromEvent('gesturestart', targetEl)
  // const gestureEnd$ = fromEvent('gestureend', targetEl)

  const pointerDowns$ = merge(mouseDowns$, touchStarts$) // mouse & touch interactions starts
  const pointerUps$ = merge(mouseUps$, touchEnds$) // mouse & touch interactions ends
  const pointerMoves$ = merge(mouseMoves$, touchMoves$)

  function preventScroll (targetEl) {
    fromEvent('mousewheel', targetEl).forEach(preventDefault)
    fromEvent('DOMMouseScroll', targetEl).forEach(preventDefault)
    fromEvent('wheel', targetEl).forEach(preventDefault)
    fromEvent('touchmove', targetEl).forEach(preventDefault)
  }

  if (options.preventScroll) {
    preventScroll(targetEl)
  }

  const wheel$ = merge(
    fromEvent('wheel', targetEl),
    fromEvent('DOMMouseScroll', targetEl),
    fromEvent('mousewheel', targetEl)
  ).map(normalizeWheel)

  return {
    mouseDowns$,
    mouseUps$,
    mouseMoves$,

    rightClicks$,
    wheel$,

    touchStarts$,
    touchMoves$,
    touchEnds$,

    pointerDowns$,
    pointerUps$,
  pointerMoves$}
}

export function pointerGestures (baseInteractions, options) {
  const defaults = {
    multiClickDelay: 250, // delay between clicks/taps
    longPressDelay: 250, // delay after which we have a 'press'
    maxStaticDeltaSqr: 100, // max 100 pixels delta above which we are not static
    zoomMultiplier: 200, // zoomFactor for normalized interactions across browsers
    pinchThreshold: 4000, // The minimum amount in pixels the inputs must move until it is fired.
    pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1
  }
  const settings = Object.assign({}, defaults, options)

  const taps$ = taps(baseInteractions, settings)
  const drags$ = drags(baseInteractions, settings)
  const zooms$ = zooms(baseInteractions, settings)

  return {
    taps: taps$,
    drags: drags$,
    zooms: zooms$,
    pointerMoves: baseInteractions.pointerMoves$
  }
}
