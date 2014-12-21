var ActionTypes = require('./Actions').Types;
var EventEmitter = require('events');
var merge = require('../util/merge');
var SubscriptionReleaser = require('../util/SubscriptionReleaser');
var TafareejDispatcher = require('./TafareejDispatcher');

var CHANGE_EVENT = 'change';
var DEBUGGING_PREFIX = 'debug__';

type Payload = {action: Object; source: string};


class BaseStore extends EventEmitter {

  constructor() {
    super();
    this._registerForDebugging();
    this.dispatchToken = TafareejDispatcher.register(
      (payload) => this._baseDispatchHandler(payload)
    );
  }

  subscribe(fn: Function): SubscriptionReleaser {
    this.addListener(CHANGE_EVENT, fn);
    return new SubscriptionReleaser(this, CHANGE_EVENT, fn);
  }

  onDispatch(): ?boolean {}

  getDebugName(): string {
    return this.constructor.name;
  }

  _registerForDebugging() {
    var name = this.getDebugName();
    window[DEBUGGING_PREFIX + name] = this;
  }

  _baseDispatchHandler(payload: Payload) {
    if (this.onDispatch(payload)) {
      this.emit(CHANGE_EVENT);
    }
  }
};

module.exports = BaseStore;
