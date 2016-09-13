'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUEUE_STATES = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.clearAllJobs = clearAllJobs;
exports.getJobById = getJobById;
exports.removeItemById = removeItemById;
exports.setStatus = setStatus;
exports.getNext = getNext;
exports.addItems = addItems;
exports.addItem = addItem;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _storage = require('./storage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QUEUE_STATES = exports.QUEUE_STATES = {
  failed: 'failed',
  success: 'success',
  pending: 'pending'
};

function clearAllJobs() {
  return (0, _storage.getCollection)('queue').then(function (c) {
    return c.remove();
  });
}
function getJobById(id) {
  return (0, _storage.getCollection)('queue').then(function (c) {
    return c.findOne({ _id: (0, _storage.safeId)(id) }).then(function (doc) {
      if (!doc) throw new Error('No job found for id ' + id);
      return doc;
    });
  });
}

function removeItemById(id) {
  return (0, _storage.getCollection)('queue').then(function (c) {
    return c.remove({ _id: id });
  });
}

function setStatus(id, status) {
  return (0, _storage.getCollection)('queue').then(function (c) {
    return c.updateOne({ _id: (0, _storage.safeId)(id) }, { $set: { status: status } });
  });
}

function getNext(filter) {
  return (0, _storage.getCollection)('queue').then(function (c) {
    var query = filter || { when: { $lte: (0, _moment2.default)().toISOString() }, status: QUEUE_STATES.pending };
    return c.find(query).toArray();
  });
}

function addItems(tasks) {
  return Promise.all(tasks.map(function (t) {
    return addItem(t);
  }));
}

function addItem(task, payload) {

  var when = (0, _moment2.default)();
  if (task.delay) {
    var _task$delay$split = task.delay.split(/\s+/);

    var _task$delay$split2 = _slicedToArray(_task$delay$split, 2);

    var count = _task$delay$split2[0];
    var unit = _task$delay$split2[1];

    when.add(count, unit);
  }
  return (0, _storage.getCollection)('queue').then(function (c) {
    return c.insertOne({
      when: when.toISOString(),
      task: task._id,
      status: QUEUE_STATES.pending,
      payload: payload || []
    }).then(function (res) {
      return { id: res.insertedId };
    });
  });
}