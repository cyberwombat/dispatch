'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var uri = process.env.DISPATCH_MONGO_URI || 'mongodb://localhost/dispatchjs';

exports.default = {
  connection: (0, _joi.object)().keys({
    uri: (0, _joi.string)().regex(/^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\w+?)(:(\d+))?\/(\w+?)$/).default(uri).required()
  })
};