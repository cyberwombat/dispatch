'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNextToQueue = addNextToQueue;
exports.registerHandlers = registerHandlers;
exports.addPendingToQueue = addPendingToQueue;
exports.markProcessedAndContinue = markProcessedAndContinue;
exports.runTask = runTask;
exports.doRun = doRun;

var _dispatcher = require('./dispatcher');

var _queue = require('./queue');

var _logger = require('../utils/logger');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handlers = void 0;
function addNextToQueue(id, status, payload) {
  return (0, _queue.getJobById)(id).then(function (job) {
    return (0, _dispatcher.getTaskById)(job.task).then(function (task) {
      var event = task.run + '.' + task.code + '.' + status;
      (0, _logger.debug)('Firing event ' + event);
      return (0, _dispatcher.getTasks)(event).then(function (tasks) {
        return _bluebird2.default.all(tasks.map(function (task) {
          return (0, _queue.addItem)(task, payload);
        }));
      });
    });
  });
}
function registerHandlers(h) {
  handlers = h;
}
function addPendingToQueue() {
  return (0, _dispatcher.getTasks)().then(_queue.addItems);
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
      handler: task.run,
      data: result
    });
    return p;
  }

  function doNext() {
    var statuses = success ? ['success', 'done'] : ['error', 'done'];
    var payload = buildPayload(data);
    var promises = statuses.map(function (s) {
      return addNextToQueue(job._id, s, payload);
    });
    return _bluebird2.default.all(promises);
  }

  return (0, _queue.setStatus)(job._id, success ? _queue.QUEUE_STATES.success : _queue.QUEUE_STATES.failed).then(doNext);
}

function runTask(task, job) {
  var run = handlers[task.run].run;

  var p = { params: task.params, payload: job.payload };

  return _bluebird2.default.try(function () {
    return run(p);
  }).then(function (res) {
    return {
      job: job,
      task: task,
      result: res,
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
      return (0, _dispatcher.getTaskByIdMarkUsed)(job.task).then(function (task) {
        return runTask(task, job);
      }).then(markProcessedAndContinue);
    }));
  });
}