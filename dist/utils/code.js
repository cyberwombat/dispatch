'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCode = generateCode;
exports.generateFunctionHash = generateFunctionHash;

var _crypto = require('crypto');

var _lodash = require('lodash');

function generateCode() {
  return (0, _lodash.sampleSize)('abcdef0123456789', 10).join('');
}

function generateFunctionHash(str) {
  return (0, _crypto.createHash)('md5').update(String(str), 'utf8').digest('hex');
}