'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOptions = setOptions;
exports.getOptions = getOptions;
exports.validateOptions = validateOptions;

var _joi = require('joi');

var options = {};
function setOptions(name, o) {
  options[name] = {
    validated: false,
    options: o
  };
}

function getOptions(name, schema) {
  return options[name] && options[name].validated ? options[name].options : validateOptions(name, schema);
}

function validateOptions(name, schema) {
  if (!options[name]) throw new Error('Options not set for ' + name);
  var validation = (0, _joi.validate)(options[name].options, schema, { stripUnknown: true, abortEarly: false, convert: true });
  if (validation.error) {
    throw new Error(validation.error);
  }
  options[name].validate = true;
  return options[name].options;
}