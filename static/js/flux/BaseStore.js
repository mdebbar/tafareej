var ActionTypes = require('./Actions').Types;
var EventEmitter = require('events');
var merge = require('../util/merge');
var TafareejDispatcher = require('./TafareejDispatcher');

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

  onDispatch(): ?boolean {}

  getDebuggingName(): string {
    return this.constructor.name;
  }

  _registerForDebugging() {
    var name = this.getDebuggingName();
    window[DEBUGGING_PREFIX + name] = this;
  }

  _baseDispatchHandler(payload: Payload) {
    if (this.onDispatch(payload)) {
      this.emit('change');
    }
  }
};

module.exports = BaseStore;
