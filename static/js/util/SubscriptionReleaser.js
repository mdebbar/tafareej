var EventEmitter = require('events');

class SubscriptionReleaser {
  constructor(emitter: EventEmitter, event: string, fn: Function) {
    this.emitter = emitter;
    this.event = event;
    this.fn = fn;
  }

  release() {
    this.emitter.removeListener(this.event, this.fn);
  }
}

module.exports = SubscriptionReleaser;
