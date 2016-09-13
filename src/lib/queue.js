import moment from 'moment'
import { getCollection, safeId } from './storage'

export const QUEUE_STATES = {
  failed: 'failed',
  success: 'success',
  pending: 'pending'
}

export function clearAllJobs () {
  return getCollection('queue').then(c => {
    return c.remove()
  })
}
export function getJobById (id) {
  return getCollection('queue').then(c => {
    return c.findOne({ _id: safeId(id) }).then(function (doc) {
      if (!doc) throw new Error('No job found for id ' + id)
      return doc
    })
  })
}

export function removeItemById (id) {
  return getCollection('queue').then(c => {
    return c.remove({ _id: id })
  })
}

export function setStatus (id, status) {
  return getCollection('queue').then(c => {
    return c.updateOne({ _id: safeId(id) }, { $set: { status: status } })
  })
}

export function getNext (filter) {
  return getCollection('queue').then(c => {
    const query = filter || { when: { $lte: moment().toISOString() }, status: QUEUE_STATES.pending }
    return c.find(query).toArray()
  })
}

export function addItems (tasks) {
  return Promise.all(tasks.map(t => {
    return addItem(t)
  }))
}

export function addItem (task, payload) {
  
  var when = moment()
  if (task.delay) {
    const [count, unit] = task.delay
    when.add(count, unit)
  }
  return getCollection('queue').then(c => {
    return c.insertOne({
      when: when.toISOString(),
      task: task._id,
      status: QUEUE_STATES.pending,
      payload: payload || []
    }).then(res => {
      return { id: res.insertedId }
    })
  })
}
