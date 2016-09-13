'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.normalizeHandler = normalizeHandler;
exports.normalizeTask = normalizeTask;
exports.normalizeEvent = normalizeEvent;

var _modeler = require('../utils/modeler');

var _handler = require('../schemas/handler');

var _handler2 = _interopRequireDefault(_handler);

var _task = require('../schemas/task');

var _task2 = _interopRequireDefault(_task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeHandler(data) {
  return (0, _modeler.createFromSchema)(data, _handler2.default);
}

function normalizeTask(data) {
  return (0, _modeler.createFromSchema)(data, _task2.default);
}

function normalizeEvent(event) {
  var _event$split = event.split('.');

  var _event$split2 = _slicedToArray(_event$split, 3);

  var handler = _event$split2[0];
  var _event$split2$ = _event$split2[1];
  var instance = _event$split2$ === undefined ? '*' : _event$split2$;
  var _event$split2$2 = _event$split2[2];
  var status = _event$split2$2 === undefined ? 'success' : _event$split2$2;

  return handler + '.' + instance + '.' + status;
}