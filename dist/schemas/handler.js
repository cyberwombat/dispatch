'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

exports.default = {
  name: (0, _joi.string)().alphanum().lowercase().required(),
  run: (0, _joi.func)().required(),
  validate: (0, _joi.func)()
};