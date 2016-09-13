'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.clearAllTasks = clearAllTasks;
exports.clearTasksByTag = clearTasksByTag;
exports.getTaskById = getTaskById;
exports.getTaskByIdMarkUsed = getTaskByIdMarkUsed;
exports.getTasks = getTasks;
exports.createTask = createTask;
exports.loadTask = loadTask;
exports.loadTasks = loadTasks;

var _storage = require('./storage');

var _lodash = require('lodash');

var _logger = require('../utils/logger');

var _modeler = require('../utils/modeler');

var _task = require('../schemas/task');

var _task2 = _interopRequireDefault(_task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clearAllTasks() {
  return (0, _storage.getCollection)('tasks').then(function (c) {
    return c.remove();
  });
}

function clearTasksByTag(tag) {
  return (0, _storage.getCollection)('tasks').then(function (c) {
    return c.remove({
      tags: tag
    });
  });
}

function getTaskById(id) {
  return (0, _storage.getCollection)('tasks').then(function (c) {
    return c.findOne({ _id: (0, _storage.safeId)(id) }).then(function (doc) {
      if (!doc) throw new Error('No task found for id ' + id);
      return doc;
    });
  });
}

function getTaskByIdMarkUsed(id) {
  return (0, _storage.getCollection)('tasks').then(function (c) {
    return c.findAndModify({ _id: (0, _storage.safeId)(id) }, [], { $inc: { count: 1 } }).then(function (doc) {
      if (!doc) throw new Error('No task found for id ' + id);
      return doc.value;
    });
  });
}

function getTasks(event) {
  return (0, _storage.getCollection)('tasks').then(function (c) {
    var match = {
      $or: [{
        limit: 0
      }, {
        valid: 1
      }]
    };

    if (event) {
      var _event$split = event.split('.');

      var _event$split2 = _slicedToArray(_event$split, 3);

      var handler = _event$split2[0];
      var code = _event$split2[1];
      var status = _event$split2[2];

      var choices = [code + '.' + status, // exact item and status
      handler + '.' + status, // exact handler and status, any instancce
      '' + handler, // exact handler, all instances and statuses
      '' + code, // exact item any status
      '' + status // any item with status
      ];
      match.on = { $in: choices };
    } else {
      match.on = { $exists: false };
    }
    return c.aggregate([{
      $project: {
        valid: {
          $cmp: ['$limit', '$count']
        },
        limit: 1,
        count: 1,
        on: 1,
        description: 1,
        delay: 1,
        code: 1,
        run: 1,
        params: 1,
        tags: 1

      }
    }, {
      $match: match
    }]).toArray().then(function (docs) {
      if (event && docs.length) (0, _logger.debug)('Found ' + docs.length + ' tasks in response to event ' + event);
      return docs;
    });
  });
}

function createTask(data) {
  return (0, _modeler.createFromSchema)(data, _task2.default);
}

function loadTask(data) {
  var task = createTask(data);

  return (0, _storage.getCollection)('tasks').then(function (c) {

    return c.insertOne(task).then(function (res) {
      return res.insertedId;
    });
  }).catch(function (e) {
    return console.log;
  });
}

function loadTasks(tasks) {
  return Promise.all((0, _lodash.map)(tasks, function (task) {
    return loadTask(task);
  }));
}