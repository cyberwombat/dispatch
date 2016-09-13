import { config, Logger, transports } from 'winston'

config.addColors({debug: 'yellow',info: 'cyan',silly: 'magenta',warn: 'yellow',error: 'red'})

const logger = new Logger({
  transports: [
    new (transports.Console)({ level: 'debug',  colorize: true })
  ]
})

export function debug (args) {
  logger.debug(args)
}
export function warn (args) {
  logger.warn(args)
}
export function error (args) {
  logger.error(args)
}
