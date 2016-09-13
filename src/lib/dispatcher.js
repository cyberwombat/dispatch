import { addTaskToQueueByEvent } from './processor'


export function triggerEvent(event) {
  return addTaskToQueueByEvent(event).then(task => {

  })
}