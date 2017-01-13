import { merge } from 'most'

// based on http://jsfiddle.net/mattpodwysocki/pfCqq/
export function mouseDrags (mouseDowns$, mouseUps, mouseMoves, settings) {
  return mouseDowns$.flatMap(function (md) {
    // calculate offsets when mouse down
    let startX = md.offsetX * window.devicePixelRatio
    let startY = md.offsetY * window.devicePixelRatio
    // Calculate delta with mousemove until mouseup
    let prevX = startX
    let prevY = startY

    return mouseMoves
      .map(function (e) {
        let curX = e.clientX * window.devicePixelRatio
        let curY = e.clientY * window.devicePixelRatio

        let delta = {
          left: curX - startX,
          top: curY - startY,
          x: prevX - curX,
          y: curY - prevY
        }

        prevX = curX
        prevY = curY

        const normalized = {x: curX, y: curY}
        return {mouseEvent: e, delta, normalized, type: 'mouse'}
      })
      .takeUntil(mouseUps)
  })
}

export function touchDrags (touchStart$, touchEnd$, touchMove$, settings) {
  return touchStart$
    .flatMap(function (ts) {
      let startX = ts.touches[0].pageX * window.devicePixelRatio
      let startY = ts.touches[0].pageY * window.devicePixelRatio

      let prevX = startX
      let prevY = startY

      return touchMove$
        .map(function (e) {
          let curX = e.touches[0].pageX * window.devicePixelRatio
          let curY = e.touches[0].pageY * window.devicePixelRatio

          let x = (curX - startX)
          let y = (curY - startY)

          let delta = {
            left: x,
            top: y,
            x: (prevX - curX),
            y: (curY - prevY)
          }

          prevX = curX
          prevY = curY

          // let output = assign({}, e, {delta})
          const normalized = {x: curX, y: curY}
          return {mouseEvent: e, delta, normalized, type: 'touch'}
        })
        .takeUntil(touchEnd$)
    })
}

/* drag move interactions press & move(continuously firing)
*/
export function dragMoves ({mouseDowns$, mouseUps$, mouseMoves$, touchStart$, touchEnd$, longTaps$, touchMoves$}, settings) {
  const dragMoves$ = merge(
    mouseDrags(mouseDowns$, mouseUps$, mouseMoves$, settings),
    touchDrags(touchStart$, touchEnd$, touchMoves$, settings)
  )
  // .merge(merge(touchEnd$, mouseUps$).map(undefined))
  // .tap(e=>console.log('dragMoves',e))

  // .takeUntil(longTaps$) // .repeat() // no drag moves if there is a context action already taking place

  return dragMoves$
}
