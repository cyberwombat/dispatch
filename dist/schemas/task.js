'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _lodash = require('lodash');

exports.default = {
  _id: (0, _joi.any)(),
  on: (0, _joi.array)().single(),
  description: (0, _joi.string)().allow(''),
  delay: (0, _joi.string)().allow(null),
  valid: (0, _joi.boolean)(),
  limit: (0, _joi.number)().min(0).integer().default(1),
  count: (0, _joi.number)().min(0).integer().default(0),
  code: (0, _joi.string)().default((0, _lodash.sampleSize)('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5).join('')),
  run: (0, _joi.string)().required(),
  params: (0, _joi.object)().default({}),
  tags: (0, _joi.array)().items((0, _joi.string)()).single().sparse()
};