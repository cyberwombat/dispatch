import { validate } from 'joi'

export function createFromSchema (data, schema) {
  const validation = validate(data, schema, { stripUnknown: true, abortEarly: false, convert: true })
  if (validation.error) {
    throw new Error(validation.error)
  }
  return validation.value
}
