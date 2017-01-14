'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _index = require('./index');

var _browserEnv = require('browser-env');

var _browserEnv2 = _interopRequireDefault(_browserEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _browserEnv2.default)();

// NOTE : use   // --inspect --debug-brk to debug node commands in chrome
_ava2.default.afterEach.always(function (t) {});

_ava2.default.beforeEach(function (t) {
  var div = document.createElement('div');
  var baseStreams = (0, _index.baseInteractionsFromEvents)(div);
  t.context = { baseStreams: baseStreams, div: div };
});

_ava2.default.cb('presses', function (t) {
  var press = (0, _index.pointerGestures)(t.context.baseStreams).press;

  var div = t.context.div;
  var mousedown = new window.Event('mousedown');
  var mouseup = new window.Event('mouseup');

  setTimeout(function () {
    div.dispatchEvent(mousedown);
    div.dispatchEvent(mouseup);
  }, 100);

  press.forEach(function () {
    t.pass();
    t.end();
  });
});

_ava2.default.cb('taps (2 taps)', function (t) {
  var taps = (0, _index.pointerGestures)(t.context.baseStreams).taps;

  var div = t.context.div;
  var mousedown = new window.Event('mousedown');
  var mouseup = new window.Event('mouseup');

  setTimeout(function () {
    mousedown.offsetX = 3;
    mousedown.offsetY = -10;
    mousedown.clientX = 3;
    mousedown.clientY = -10;
    mouseup.offsetX = 10;
    mouseup.offsetY = -3;
    mouseup.clientX = 10;
    mouseup.clientY = -3;
    div.dispatchEvent(mousedown);
    div.dispatchEvent(mouseup);
  }, 100);

  setTimeout(function () {
    mousedown.offsetX = 13;
    mousedown.offsetY = -4;
    mousedown.clientX = 13;
    mousedown.clientY = -4;
    mouseup.offsetX = 14;
    mouseup.offsetY = -2;
    mouseup.clientX = 14;
    mouseup.clientY = -2;
    div.dispatchEvent(mousedown);
    div.dispatchEvent(mouseup);
  }, 200);

  taps.forEach(function (e) {
    t.deepEqual(e.nb, 2);
    t.deepEqual(e.list.length, 2);
    t.end();
  });
});

_ava2.default.cb('taps (3 taps)', function (t) {
  var taps = (0, _index.pointerGestures)(t.context.baseStreams).taps;

  var div = t.context.div;
  var mousedown = new window.Event('mousedown');
  var mouseup = new window.Event('mouseup');

  setTimeout(function () {
    mousedown.offsetX = 3;
    mousedown.offsetY = -10;
    mousedown.clientX = 3;
    mousedown.clientY = -10;
    mouseup.offsetX = 10;
    mouseup.offsetY = -3;
    mouseup.clientX = 10;
    mouseup.clientY = -3;
    div.dispatchEvent(mousedown);
    div.dispatchEvent(mouseup);
  }, 100);

  setTimeout(function () {
    mousedown.offsetX = 13;
    mousedown.offsetY = -4;
    mousedown.clientX = 13;
    mousedown.clientY = -4;
    mouseup.offsetX = 14;
    mouseup.offsetY = -2;
    mouseup.clientX = 14;
    mouseup.clientY = -2;
    div.dispatchEvent(mousedown);
    div.dispatchEvent(mouseup);
  }, 200);

  setTimeout(function () {
    mousedown.offsetX = 11;
    mousedown.offsetY = -2;
    mousedown.clientX = 11;
    mousedown.clientY = -2;
    mouseup.offsetX = 14;
    mouseup.offsetY = -2;
    mouseup.clientX = 14;
    mouseup.clientY = -2;
    div.dispatchEvent(mousedown);
    div.dispatchEvent(mouseup);
  }, 300);

  taps.forEach(function (e) {
    t.deepEqual(e.nb, 3);
    t.deepEqual(e.list.length, 3);
    t.end();
  });
});

_ava2.default.cb('zooms (from wheel event)', function (t) {
  var zooms = (0, _index.pointerGestures)(t.context.baseStreams).zooms;

  var div = t.context.div;
  var wheel = new window.Event('wheel');
  setTimeout(function () {
    div.dispatchEvent(wheel);
  }, 100);

  zooms.forEach(function (e) {
    t.deepEqual(e, -200);
    t.end();
  });
});

_ava2.default.cb('zooms (from mousewheel event)', function (t) {
  var zooms = (0, _index.pointerGestures)(t.context.baseStreams).zooms;

  var div = t.context.div;
  var wheel = new window.Event('mousewheel');
  setTimeout(function () {
    div.dispatchEvent(wheel);
  }, 100);

  zooms.forEach(function (e) {
    t.deepEqual(e, -200);
    t.end();
  });
});

_ava2.default.cb('zooms (from pinch)', function (t) {
  var zooms = (0, _index.pointerGestures)(t.context.baseStreams).zooms;

  var div = t.context.div;
  var touchstart = new window.Event('touchstart');
  var touchmove = new window.Event('touchmove');
  var touchend = new window.Event('touchend');

  setTimeout(function () {
    touchstart.touches = [{ pageX: 3, pageY: -10 }, { pageX: 43, pageY: 0 }];
    touchmove.touches = [{ pageX: 44, pageY: -2 }, { pageX: 244, pageY: 122 }];
    touchend.touches = [{ pageX: 144, pageY: -22 }, { pageX: 644, pageY: 757 }];
    div.dispatchEvent(touchstart);
    div.dispatchEvent(touchmove);
    div.dispatchEvent(touchend);
  }, 100);

  zooms.forEach(function (e) {
    t.deepEqual(e, 32.205600000000004);
    t.end();
  });
});

_ava2.default.cb('drags (mouse)', function (t) {
  var drags = (0, _index.pointerGestures)(t.context.baseStreams).drags;

  var div = t.context.div;
  var mousedown = new window.Event('mousedown');
  var mouseup = new window.Event('mouseup');
  var mousemove = new window.Event('mousemove');

  setTimeout(function () {
    mousedown.offsetX = 3;
    mousedown.offsetY = -10;
    mousedown.clientX = 3;
    mousedown.clientY = -10;

    mousemove.offsetX = 44;
    mousemove.offsetY = -2;
    mousemove.clientX = 44;
    mousemove.clientY = -2;

    mouseup.offsetX = 144;
    mouseup.offsetY = -22;
    mouseup.clientX = 144;
    mouseup.clientY = -22;

    div.dispatchEvent(mousedown);
    div.dispatchEvent(mousemove);
    div.dispatchEvent(mouseup);
  }, 100);

  drags.forEach(function (e) {
    var expEvent = {
      mouseEvent: { isTrusted: false },
      delta: { left: 41, top: 8, x: -41, y: 8 },
      normalized: { x: 44, y: -2 },
      type: 'mouse'
    };
    t.deepEqual(e.delta, expEvent.delta);
    t.deepEqual(e.normalized, expEvent.normalized);
    t.deepEqual(e.type, expEvent.type);
    t.end();
  });
});

_ava2.default.cb('drags (touch)', function (t) {
  var drags = (0, _index.pointerGestures)(t.context.baseStreams).drags;

  var div = t.context.div;
  var touchstart = new window.Event('touchstart');
  var touchmove = new window.Event('touchmove');
  var touchend = new window.Event('touchend');

  setTimeout(function () {
    touchstart.touches = [{ pageX: 3, pageY: -10 }];
    touchmove.touches = [{ pageX: 44, pageY: -2 }];
    touchend.touches = [{ pageX: 144, pageY: -22 }];
    div.dispatchEvent(touchstart);
    div.dispatchEvent(touchmove);
    div.dispatchEvent(touchend);
  }, 100);

  drags.forEach(function (e) {
    var expEvent = {
      mouseEvent: { isTrusted: false },
      delta: { left: 41, top: 8, x: -41, y: 8 },
      normalized: { x: 44, y: -2 },
      type: 'touch'
    };
    t.deepEqual(e.delta, expEvent.delta);
    t.deepEqual(e.normalized, expEvent.normalized);
    t.deepEqual(e.type, expEvent.type);
    t.end();
  });
});