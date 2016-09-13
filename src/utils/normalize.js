import { createFromSchema } from '../utils/modeler'

import handlerSchema from '../schemas/handler'
import taskSchema from '../schemas/task'

export function normalizeHandler (data) {
  return createFromSchema(data, handlerSchema)
}

export function normalizeTask (data) {
  return createFromSchema(data, taskSchema)
}

export function normalizeEvent (event) {
  const [handler, instance = '*', status = 'success'] = event.split('.')
  return `${handler}.${instance}.${status}`
}
