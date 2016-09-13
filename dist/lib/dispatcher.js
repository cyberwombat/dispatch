'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerEvent = triggerEvent;

var _processor = require('./processor');

function triggerEvent(event) {
  return (0, _processor.addTaskToQueueByEvent)(event).then(function (task) {});
}