import { string, object } from 'joi'

const uri = process.env.DISPATCH_MONGO_URI || 'mongodb://localhost/dispatchjs'

export default {
  connection: object().keys({
    uri: string().regex(/^(mongodb:(?:\/{2})?)((\w+?):(\w+?)@|:?@?)(\w+?)(:(\d+))?\/(\w+?)$/).default(uri).required()
  })
}
