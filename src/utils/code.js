import { createHash } from 'crypto'
import { sampleSize } from 'lodash'

export function generateCode () {
  return sampleSize('abcdef0123456789', 10).join('')
}

export function generateFunctionHash (str) {
  return createHash('md5').update(String(str), 'utf8').digest('hex')
}
