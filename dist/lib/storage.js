'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConnection = setConnection;
exports.getConnection = getConnection;
exports.getCollection = getCollection;
exports.safeId = safeId;

var _mongodb = require('mongodb');

var _config = require('./config');

var connection = void 0;

// Set existing connection
function setConnection(c) {
  connection = c;
}

// Fetch and/or create a Mongo connection
function getConnection(c) {
  return !connection ? connection = _mongodb.MongoClient.connect((0, _config.getConfig)().connection.uri) : connection;
}

// Fetch a connection for a collection
function getCollection(collection) {
  return getConnection().then(function (c) {
    return c.collection(collection);
  });
}

// Helper to make safe ObjectIDs when receiving from the wild
function safeId(id) {
  try {
    return id ? (0, _mongodb.ObjectId)(id) : undefined;
  } catch (e) {}
}