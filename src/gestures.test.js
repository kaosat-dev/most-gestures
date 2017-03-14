import test from 'ava'
import { baseInteractionsFromEvents, pointerGestures } from './index'
import browserEnv from 'browser-env'
browserEnv()

// NOTE : use   // --inspect --debug-brk to debug node commands in chrome
test.afterEach.always(t => {
})

test.beforeEach(t => {
  const div = document.createElement('div')
  const baseStreams = baseInteractionsFromEvents(div)
  t.context = {baseStreams, div}
})


test.cb('presses', t => {
  const press = pointerGestures(t.context.baseStreams).press

  const div = t.context.div
  const mousedown = new window.Event('mousedown')
  const mouseup = new window.Event('mouseup')

  setTimeout(function () {
    div.dispatchEvent(mousedown)
    div.dispatchEvent(mouseup)
  }, 100)

  press
    .forEach(function () {
      test.todo('the test is not implemented correctly yet !')//pass()
      t.end()
    })
})

test.cb('taps (2 taps)', t => {
  const taps = pointerGestures(t.context.baseStreams).taps

  const div = t.context.div
  let mousedown = new window.Event('mousedown')
  let mouseup = new window.Event('mouseup')

  setTimeout(function () {
    mousedown.offsetX = 3
    mousedown.offsetY = -10
    mousedown.clientX = 3
    mousedown.clientY = -10
    mouseup.offsetX = 10
    mouseup.offsetY = -3
    mouseup.clientX = 10
    mouseup.clientY = -3
    div.dispatchEvent(mousedown)
    div.dispatchEvent(mouseup)
  }, 100)

  setTimeout(function(){
    mousedown.offsetX = 13
    mousedown.offsetY = -4
    mousedown.clientX = 13
    mousedown.clientY = -4
    mouseup.offsetX = 14
    mouseup.offsetY = -2
    mouseup.clientX = 14
    mouseup.clientY = -2
    div.dispatchEvent(mousedown)
    div.dispatchEvent(mouseup)
  }, 200)

  taps
    .forEach(function (e) {
      t.deepEqual(e.nb, 2)
      t.deepEqual(e.list.length, 2)
      t.end()
    })
})

test.cb('taps (3 taps)', t => {
  const taps = pointerGestures(t.context.baseStreams).taps

  const div = t.context.div
  let mousedown = new window.Event('mousedown')
  let mouseup = new window.Event('mouseup')

  setTimeout(function () {
    mousedown.offsetX = 3
    mousedown.offsetY = -10
    mousedown.clientX = 3
    mousedown.clientY = -10
    mouseup.offsetX = 10
    mouseup.offsetY = -3
    mouseup.clientX = 10
    mouseup.clientY = -3
    div.dispatchEvent(mousedown)
    div.dispatchEvent(mouseup)
  }, 100)

  setTimeout(function(){
    mousedown.offsetX = 13
    mousedown.offsetY = -4
    mousedown.clientX = 13
    mousedown.clientY = -4
    mouseup.offsetX = 14
    mouseup.offsetY = -2
    mouseup.clientX = 14
    mouseup.clientY = -2
    div.dispatchEvent(mousedown)
    div.dispatchEvent(mouseup)
  }, 200)

  setTimeout(function(){
    mousedown.offsetX = 11
    mousedown.offsetY = -2
    mousedown.clientX = 11
    mousedown.clientY = -2
    mouseup.offsetX = 14
    mouseup.offsetY = -2
    mouseup.clientX = 14
    mouseup.clientY = -2
    div.dispatchEvent(mousedown)
    div.dispatchEvent(mouseup)
  }, 300)

  taps
    .forEach(function (e) {
      t.deepEqual(e.nb, 3)
      t.deepEqual(e.list.length, 3)
      t.end()
    })
})

test.cb('zooms (from wheel event)', t => {
  const zooms = pointerGestures(t.context.baseStreams).zooms

  const div = t.context.div
  const wheel = new window.Event('wheel')
  setTimeout(function () {
    div.dispatchEvent(wheel)
  }, 100)

  zooms
    .forEach(function (e) {
      t.deepEqual(e, -200)
      t.end()
    })
})

test.cb('zooms (from mousewheel event)', t => {
  const zooms = pointerGestures(t.context.baseStreams).zooms

  const div = t.context.div
  const wheel = new window.Event('mousewheel')
  setTimeout(function () {
    div.dispatchEvent(wheel)
  }, 100)

  zooms
    .forEach(function (e) {
      t.deepEqual(e, -200)
      t.end()
    })
})

test.cb('zooms (from pinch)', t => {
  const zooms = pointerGestures(t.context.baseStreams).zooms

  const div = t.context.div
  const touchstart = new window.Event('touchstart')
  const touchmove = new window.Event('touchmove')
  const touchend = new window.Event('touchend')

  setTimeout(function () {
    touchstart.touches = [{pageX: 3, pageY: -10}, {pageX: 43, pageY: 0}]
    touchmove.touches = [{pageX: 44, pageY: -2}, {pageX: 244, pageY: 122}]
    touchend.touches = [{pageX: 144, pageY: -22}, {pageX: 644, pageY: 757}]
    div.dispatchEvent(touchstart)
    div.dispatchEvent(touchmove)
    div.dispatchEvent(touchend)
  }, 100)

  zooms
    .forEach(function (e) {
      t.deepEqual(e, 32.205600000000004)
      t.end()
    })
})

test.cb('drags (mouse)', t => {
  const drags = pointerGestures(t.context.baseStreams).drags

  const div = t.context.div
  const mousedown = new window.Event('mousedown')
  const mouseup = new window.Event('mouseup')
  const mousemove = new window.Event('mousemove')

  setTimeout(function () {
    mousedown.offsetX = 3
    mousedown.offsetY = -10
    mousedown.clientX = 3
    mousedown.clientY = -10

    mousemove.offsetX = 44
    mousemove.offsetY = -2
    mousemove.clientX = 44
    mousemove.clientY = -2

    mouseup.offsetX = 144
    mouseup.offsetY = -22
    mouseup.clientX = 144
    mouseup.clientY = -22

    div.dispatchEvent(mousedown)
    div.dispatchEvent(mousemove)
    div.dispatchEvent(mouseup)
  }, 100)

  drags
    .forEach(function (e) {
      const expEvent = {
        mouseEvent: {isTrusted: false},
        delta: { left: 41, top: 8, x: -41, y: 8 },
        normalized: { x: 44, y: -2 },
        type: 'mouse'
      }
      t.deepEqual(e.delta, expEvent.delta)
      t.deepEqual(e.normalized, expEvent.normalized)
      t.deepEqual(e.type, expEvent.type)
      t.end()
    })
})

test.cb('drags (touch)', t => {
  const drags = pointerGestures(t.context.baseStreams).drags

  const div = t.context.div
  const touchstart = new window.Event('touchstart')
  const touchmove = new window.Event('touchmove')
  const touchend = new window.Event('touchend')

  setTimeout(function () {
    touchstart.touches = [{pageX: 3, pageY: -10}]
    touchmove.touches = [{pageX: 44, pageY: -2}]
    touchend.touches = [{pageX: 144, pageY: -22}]
    div.dispatchEvent(touchstart)
    div.dispatchEvent(touchmove)
    div.dispatchEvent(touchend)
  }, 100)

  drags
    .forEach(function (e) {
      const expEvent = {
        mouseEvent: {isTrusted: false},
        delta: { left: 41, top: 8, x: -41, y: 8 },
        normalized: { x: 44, y: -2 },
        type: 'touch'
      }
      t.deepEqual(e.delta, expEvent.delta)
      t.deepEqual(e.normalized, expEvent.normalized)
      t.deepEqual(e.type, expEvent.type)
      t.end()
    })
})
