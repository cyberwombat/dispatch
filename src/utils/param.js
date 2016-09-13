import { validate } from 'joi'

let options = {}
export function setOptions (name, o) {
  options[name] = {
    validated: false,
    options: o
  }
}

export function getOptions (name, schema) {
  return options[name] && options[name].validated ? options[name].options : validateOptions(name, schema)
}

export function validateOptions (name, schema) {
  if(! options[name]) throw new Error(`Options not set for ${name}`)
  const validation = validate(options[name].options, schema, { stripUnknown: true, abortEarly: false, convert: true })
  if (validation.error) {
    throw new Error(validation.error)
  }
  options[name].validate = true
  return options[name].options
}
