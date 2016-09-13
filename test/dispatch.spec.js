import assert from 'assert'
import Loader from 'mongo-primer'
import { Processor, Dispatcher, Queue, Storage, Handler, Config } from '../src/index.js'

const { addTaskToQueueByEvent, doRun } = Processor
const { createTaskFromFunction } = Handler
const { loadTask, getTaskById } = Dispatcher
const { addItem } = Queue
const { setConfig } = Config
const { setConnection } = Storage

const uri = 'mongodb://localhost/dispatch'
const options = { connection: { uri: uri }}

let result
function fn () {
  result = true
}

let loader
before(() => {
  loader = new Loader({  uri})
  setConfig(options)
})

beforeEach(() => {
  return loader.clearCollections(['tasks', 'queue']).then(() => {
    return createTaskFromFunction(fn, 'whatever')
  })
})

after(() => {
  return loader.closeConnection()
})

afterEach(() => {
  // nock.cleanAll()
})

describe('Dispatch', () => {
  it('runs a task', () => {
    return addTaskToQueueByEvent('whatever').then(doRun).then(() => {
      assert.ok(result)
    })
  })
})
