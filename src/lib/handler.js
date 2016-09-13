import { getCollection, safeId } from './storage'
import { map } from 'lodash'
import { debug } from '../utils/logger'
import { normalizeEvent, normalizeTask, normalizeHandler } from '../utils/normalize'
import { registerHandler } from './processor'
import { generateCode, generateFunctionHash } from '../utils/code'

export function clearAllTasks () {
  return getCollection('tasks').then(c => {
    return c.remove()
  })
}

export function clearTasksByTag (tag) {
  return getCollection('tasks').then(c => {
    return c.remove({
      tags: tag
    })
  })
}

export function clearTasksByHandler (handler) {
  return getCollection('tasks').then(c => {
    return c.remove({
      handler: handler
    })
  })
}

export function getTaskById (id) {
  return getCollection('tasks').then(c => {
    return c.findOne({ _id: safeId(id) }).then(doc => {
      if (!doc) throw new Error(`No task found for id ${id}`)
      return doc
    })
  })
}

export function markUsed (id) {
  return getCollection('tasks').then(c => {
    return c.updateOne({ _id: safeId(id) }, [], { $inc: { count: 1 } })
  })
}

export function getTaskByIdMarkUsed (id) {
  return getCollection('tasks').then(c => {
    return c.findAndModify({ _id: safeId(id) }, [], { $inc: { count: 1 } }).then(doc => {
      if (!doc) throw new Error('No task found for id ' + id)
      return doc.value
    })
  })
}

export function getTasks (event) {
  return getCollection('tasks').then(c => {
    let match = {
      $or: [
        {
          limit: 0
        }, {
          valid: 1
        }]
    }

    if (event) {
      const [handler, instance, status] = normalizeEvent(event).split('.')
      const choices = [
        event,
        `*.${instance}.${status}`, // exact item and status
        `${handler}.*.${status}`, // exact handler and status, any instancce
        `${handler}.*.*`, // exact handler, all instances and statuses
        `*.${instance}.*`, // exact item any status
        `*.*.${status}` // any item with status
      ]
      match.on = { $in: choices }
    } else {
      match.on = { $exists: false }
    }
    return c.aggregate([{
      $project: {
        valid: {
          $cmp: ['$limit', '$count']
        },
        limit: 1,
        count: 1,
        on: 1,
        description: 1,
        delay: 1,
        code: 1,
        run: 1,
        params: 1,
        tags: 1

      }
    }, {
      $match: match
    }]).toArray().then(docs => {
      if (event && docs.length) debug(`Found ${docs.length} tasks in response to event ${event}`)
      return docs
    })
  })
}

export function createTaskFromFunction (fn, event, options = {}) {
  const handler = normalizeHandler({
    name: options.name || generateFunctionHash(fn),
    run: fn
  })

  return clearTasksByHandler(handler.name)
    .then(() => {
      registerHandler(handler)
      return loadTask({
        handler: handler.name,
        on: normalizeEvent(event),
        limit: options.limit || 1,
        delay: options.delay || null
      })
    })
}

export function loadTask (data) {
  const task = normalizeTask(data)

  return getCollection('tasks').then(c => {

    return c.insertOne(task).then(res => {
      return res.insertedId
    })
  }).catch(e => console.log)
}

export function loadTasks (tasks) {
  return Promise.all(map(tasks, task => {
    return loadTask(task)
  }))
}
