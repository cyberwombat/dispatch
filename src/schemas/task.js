import { string, number, boolean, any, array, object } from 'joi'
import { generateCode } from '../utils/code'

export default {
  _id: any(),
  on: array().single(),
  description: string().allow(''),
  delay: array().length(2).allow(null),
  valid: boolean(),
  limit: number().min(0).integer().default(1),
  count: number().min(0).integer().default(0),
  code: string().default(generateCode()),
  handler: string().required(),
  params: object().default({}),
  tags: array().items(string()).single().sparse()
}
