'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFromSchema = createFromSchema;

var _joi = require('joi');

function createFromSchema(data, schema) {
  var validation = (0, _joi.validate)(data, schema, { stripUnknown: true, abortEarly: false, convert: true });
  if (validation.error) {
    throw new Error(validation.error);
  }
  return validation.value;
}