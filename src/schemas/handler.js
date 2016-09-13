import { string, func } from 'joi'

export default {
  name: string().alphanum().lowercase().required(),
  run: func().required(),
  validate: func()
}
