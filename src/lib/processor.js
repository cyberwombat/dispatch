import { getTaskById, getTaskByIdMarkUsed, getTasks, hasTaskHandler } from './handler'
import { getJobById, getNext, setStatus, addItems, addItem, QUEUE_STATES } from './queue'
import { debug } from '../utils/logger'
import { find, castArray } from 'lodash'
import Promise from 'bluebird'

let handlers = []
export function addNextToQueue (id, status, payload) {
  return getJobById(id).then(function (job) {
    return getTaskById(job.task).then(task => {
      const event = `${task.handler}.${task.code}.${status}`
      debug(`Firing event ${event}`)
      return getTasks(event).then(tasks => {
        return Promise.all(tasks.map(task => {
          return addItem(task, payload)
        }))
      })
    })
  })
}

export function findHandler (name) {
  return find(handlers, { name})
}

export function registerHandler (items) {
  for (const item of castArray(items)) {
    if (!findHandler(item.name))
      handlers.push(item)
  }
}

export function addTaskToQueueByEvent (event) {
  return getTasks(event).then(addItems)
}

export function addPendingToQueue () {
  return getTasks().then(addItems)
}

export function markProcessedAndContinue (data) {
  const { job, task, result, success } = data
  function buildPayload (data) {
    const p = job.payload || []
    p.push({
      code: task.code,
      handler: task.handler,
      data: result
    })
    return p
  }

  const status = success ? QUEUE_STATES.success : QUEUE_STATES.failed

  return setStatus(job._id, status).then(() => addNextToQueue(job._id, status, buildPayload(data)))
}

export function runTask (task, job) {
  const { run } = findHandler(task.handler)
  const p = { params: task.params, payload: job.payload }

  return Promise.try(p => {
    return run(p)
  }).then(function (res) {
    return {
      job: job,
      task: task,
      result: res || {},
      success: true
    }
  }).catch(function (err) {
    return {
      job: job,
      task: task,
      result: err.toString(),
      success: false
    }
  })
}

export function doRun () {
  return getNext().then(jobs => {
    debug(`Fetching ${jobs.length} jobs`)
    return Promise.all(jobs.map(job => {
      return getTaskById(job.task).then(task => {
        if (findHandler(task.handler)) {
          return runTask(task, job).then(markProcessedAndContinue)
        }
      })
    }))
  })
}
