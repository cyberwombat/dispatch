'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNextToQueue = addNextToQueue;
exports.findHandler = findHandler;
exports.registerHandler = registerHandler;
exports.addTaskToQueueByEvent = addTaskToQueueByEvent;
exports.addPendingToQueue = addPendingToQueue;
exports.markProcessedAndContinue = markProcessedAndContinue;
exports.runTask = runTask;
exports.doRun = doRun;

var _handler = require('./handler');

var _queue = require('./queue');

var _logger = require('../utils/logger');

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handlers = [];
function addNextToQueue(id, status, payload) {
  return (0, _queue.getJobById)(id).then(function (job) {
    return (0, _handler.getTaskById)(job.task).then(function (task) {
      var event = task.handler + '.' + task.code + '.' + status;
      (0, _logger.debug)('Firing event ' + event);
      return (0, _handler.getTasks)(event).then(function (tasks) {
        return _bluebird2.default.all(tasks.map(function (task) {
          return (0, _queue.addItem)(task, payload);
        }));
      });
    });
  });
}

function findHandler(name) {
  return (0, _lodash.find)(handlers, { name: name });
}

function registerHandler(items) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _lodash.castArray)(items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (!findHandler(item.name)) handlers.push(item);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function addTaskToQueueByEvent(event) {
  return (0, _handler.getTasks)(event).then(_queue.addItems);
}

function addPendingToQueue() {
  return (0, _handler.getTasks)().then(_queue.addItems);
}

function markProcessedAndContinue(data) {
  var job = data.job;
  var task = data.task;
  var result = data.result;
  var success = data.success;

  function buildPayload(data) {
    var p = job.payload || [];
    p.push({
      code: task.code,
      handler: task.handler,
      data: result
    });
    return p;
  }

  var status = success ? _queue.QUEUE_STATES.success : _queue.QUEUE_STATES.failed;

  return (0, _queue.setStatus)(job._id, status).then(function () {
    return addNextToQueue(job._id, status, buildPayload(data));
  });
}

function runTask(task, job) {
  var _findHandler = findHandler(task.handler);

  var run = _findHandler.run;

  var p = { params: task.params, payload: job.payload };

  return _bluebird2.default.try(function (p) {
    return run(p);
  }).then(function (res) {
    return {
      job: job,
      task: task,
      result: res || {},
      success: true
    };
  }).catch(function (err) {
    return {
      job: job,
      task: task,
      result: err.toString(),
      success: false
    };
  });
}

function doRun() {
  return (0, _queue.getNext)().then(function (jobs) {
    (0, _logger.debug)('Fetching ' + jobs.length + ' jobs');
    return _bluebird2.default.all(jobs.map(function (job) {
      return (0, _handler.getTaskById)(job.task).then(function (task) {
        if (findHandler(task.handler)) {
          return runTask(task, job).then(markProcessedAndContinue);
        }
      });
    }));
  });
}