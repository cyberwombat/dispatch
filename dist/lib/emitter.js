'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTask = runTask;

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = new _eventemitter2.default();

function runTask(data) {
  emitter.emit('runTask', data);
}

emitter.on('runTask', function (data) {

  console.log(data);

  // emitter.emit('doTrigger')
});