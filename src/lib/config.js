import { getOptions, setOptions } from '../utils/param'
import configurationSchema from '../schemas/configuration'

export function setConfig (options) {
  return setOptions('dispatchjs', options)
}

export function getConfig () {
  return getOptions('dispatchjs', configurationSchema)
}
