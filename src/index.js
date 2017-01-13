import { fromEvent, merge } from 'most'
import { normalizeWheel, preventDefault } from './utils'
import { taps } from './taps'
import { dragMoves } from './drags'
import { pinchZooms } from './zooms'

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

  const touchStart$ = fromEvent('touchstart', targetEl)
  const touchMoves$ = fromEvent('touchmove', targetEl).filter(t => t.touches.length === 1)
  const touchEnd$ = fromEvent('touchend', targetEl)

  // const gestureChange$ = fromEvent('gesturechange', targetEl)
  // const gestureStart$ = fromEvent('gesturestart', targetEl)
  // const gestureEnd$ = fromEvent('gestureend', targetEl)

  const pointerDowns$ = merge(mouseDowns$, touchStart$) // mouse & touch interactions starts
  const pointerUps$ = merge(mouseUps$, touchEnd$) // mouse & touch interactions ends
  const pointerMoves$ = merge(mouseMoves$, touchMoves$)

  const zooms$ = merge(
    merge(
      // pinchZooms(gestureChange$, gestureStart$, gestureEnd$),// for Ios
      pinchZooms(touchStart$, fromEvent('touchmove', targetEl), touchEnd$) // for Android (no gestureXX events)
    ),

    merge(
      fromEvent('wheel', targetEl),
      fromEvent('DOMMouseScroll', targetEl),
      fromEvent('mousewheel', targetEl)
    ).map(normalizeWheel)
  )

  function preventScroll (targetEl) {
    fromEvent('mousewheel', targetEl).forEach(preventDefault)
    fromEvent('DOMMouseScroll', targetEl).forEach(preventDefault)
    fromEvent('wheel', targetEl).forEach(preventDefault)
    fromEvent('touchmove', targetEl).forEach(preventDefault)
  }

  if (options.preventScroll) {
    preventScroll(targetEl)
  }

  return {
    mouseDowns$,
    mouseUps$,
    mouseMoves$,

    rightClicks$,
    zooms$,

    touchStart$,
    touchMoves$,
    touchEnd$,

    pointerDowns$,
    pointerUps$,
    pointerMoves$ }
}

export function pointerGestures (baseInteractions, options) {
  const defaults = {
    multiClickDelay: 250, // delay between clicks/taps
    longPressDelay: 250, // delay after which we have a 'press'
    maxStaticDeltaSqr: 100, // max 100 pixels delta above which we are not static
    zoomMultiplier: 200 // zoomFactor for normalized interactions across browsers
  }
  const settings = Object.assign({}, defaults, options)

  const taps$ = taps(baseInteractions, settings)
  const dragMoves$ = dragMoves(baseInteractions, settings)

  return {
    taps: taps$,
    dragMoves: dragMoves$,
    zooms: baseInteractions.zooms$.map(x => x * settings.zoomMultiplier),
    pointerMoves: baseInteractions.pointerMoves$
  }
}
