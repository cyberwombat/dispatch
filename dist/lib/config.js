'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = setConfig;
exports.getConfig = getConfig;

var _param = require('../utils/param');

var _configuration = require('../schemas/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setConfig(options) {
  return (0, _param.setOptions)('dispatchjs', options);
}

function getConfig() {
  return (0, _param.getOptions)('dispatchjs', _configuration2.default);
}