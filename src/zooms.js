//this one is not reliable enough
export function pinchZooms_old (gestureChange$, gestureStart$, gestureEnd$) {
  return gestureStart$
    .flatMap(function (gs) {
      return gestureChange$
        .map(x => x.scale)
        // .loop((prev, cur) => ({seed: cur, value: prev ? cur - prev : prev}), undefined)
        .loop(function (prev, cur) {
          console.log('prev', prev, 'cur', cur, 'value', prev ? cur - prev : prev)
          let value = prev ? cur - prev : prev

          if (value > 0) {
            value = Math.min(Math.max(value, 0), 2)
          } else {
            value = Math.min(Math.max(value, 2), 0)
          }

          return {seed: cur, value}
        }, undefined)
        .filter(x => x !== undefined)
        // .map(x => x / x)
        .takeUntil(gestureEnd$)
    }).tap(e => console.log('pinchZooms', e))
}


export function pinchZooms (touchStart$, touchMoves$, touchEnd$) {
  const threshold = 4000 // The minimum amount in pixels the inputs must move until it is fired.
  // generic custom gesture handling
  // very very vaguely based on http://stackoverflow.com/questions/11183174/simplest-way-to-detect-a-pinch
  return touchStart$
    .filter(t => t.touches.length === 2)
    .flatMap(function (ts) {
      let startX1 = ts.touches[0].pageX * window.devicePixelRatio
      let startY1 = ts.touches[0].pageY * window.devicePixelRatio

      let startX2 = ts.touches[1].pageX * window.devicePixelRatio
      let startY2 = ts.touches[1].pageY * window.devicePixelRatio

      const startDist = ((startX1 - startX2) * (startX1 - startX2)) + ((startY1 - startY2) * (startY1 - startY2))

      return touchMoves$
        .tap(e => e.preventDefault())
        .filter(t => t.touches.length === 2)
        .map(function (e) {
          let curX1 = e.touches[0].pageX * window.devicePixelRatio
          let curY1 = e.touches[0].pageY * window.devicePixelRatio

          let curX2 = e.touches[1].pageX * window.devicePixelRatio
          let curY2 = e.touches[1].pageY * window.devicePixelRatio

          const currentDist = ((curX1 - curX2) * (curX1 - curX2)) + ((curY1 - curY2) * (curY1 - curY2))
          return currentDist
        })
        .loop(function (prev, cur) {
          if (prev) {
            if (Math.abs(cur - prev) < threshold) {
              return {seed: cur, value: undefined}
            }
            return {seed: cur, value: cur - prev}
          }
          return {seed: cur, value: cur - startDist}
        }, undefined)
        .filter(x => x !== undefined)
        .map(x => x * 0.000003) // arbitrary, in order to harmonise desktop /mobile up to a point
        /* .map(function (e) {
          const scale = e > 0 ? Math.sqrt(e) : -Math.sqrt(Math.abs(e))
          return scale
        })*/
        .takeUntil(touchEnd$)
    })
}
