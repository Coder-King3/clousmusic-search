class EventBus {
  constructor() {
    this.eventBus = {}
  }

  on(eventName, eventCallback, thisArg) {
    let handles = this.eventBus[eventName]
    if (!handles) {
      handles = []
      this.eventBus[eventName] = handles
    }
    handles.push({
      eventCallback,
      thisArg
    })
  }

  off(eventName, eventCallback) {
    let handles = this.eventBus[eventName]
    if (!handles) return

    if (!eventCallback || handles.length === 0) {
      delete this.eventBus[eventName]
    } else {
      for (let i = 0; i < handles.length; i++) {
        const handler = handles[i].eventCallback
        if (handler === eventCallback) {
          handles.splice(i, 1)
          break
        }
      }
    }
  }

  emit(eventName, ...payload) {
    let handles = this.eventBus[eventName]
    if (!handles) return

    handles.forEach(({ eventCallback, thisArg }) => {
      eventCallback.apply(thisArg, payload)
    })
  }

  clear() {
    this.eventBus = {}
  }

  hasEvent(eventName) {
    return Object.keys(this.eventBus).includes(eventName)
  }
}

const eventBus = new EventBus()

export default eventBus
