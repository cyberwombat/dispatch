'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = debug;
exports.warn = warn;
exports.error = error;

var _winston = require('winston');

_winston.config.addColors({ debug: 'yellow', info: 'cyan', silly: 'magenta', warn: 'yellow', error: 'red' });

var logger = new _winston.Logger({
  transports: [new _winston.transports.Console({ level: 'debug', colorize: true })]
});

function debug(args) {
  logger.debug(args);
}
function warn(args) {
  logger.warn(args);
}
function error(args) {
  logger.error(args);
}