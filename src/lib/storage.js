import { MongoClient, ObjectId } from 'mongodb'
import { getConfig } from './config'

let connection

// Set existing connection
export function setConnection (c) {
  connection  = c
}

// Fetch and/or create a Mongo connection
export function getConnection (c) {
  return !connection ? connection = MongoClient.connect(getConfig().connection.uri) : connection
}


// Fetch a connection for a collection
export function getCollection (collection) {
  return getConnection().then(c => {
    return c.collection(collection)
  })
}

// Helper to make safe ObjectIDs when receiving from the wild
export function safeId (id) {
  try {
    return id ? ObjectId(id) : undefined
  } catch (e) {}
}
