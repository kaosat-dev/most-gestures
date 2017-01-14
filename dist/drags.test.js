'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE : use   // --inspect --debug-brk to debug node commands in chrome
_ava2.default.afterEach.always(function (t) {});

_ava2.default.beforeEach(function (t) {
  var jscadPath = '../dist/cli';
  t.context = {
    jscadPath: _path2.default.resolve(__dirname, jscadPath)
  };
});

(0, _ava2.default)('drags', function (t) {});