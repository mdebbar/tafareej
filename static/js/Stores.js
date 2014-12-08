var GLOBAL_KEY = '*';

class StoreClass {

  constructor(name) {
    this.name = name;
    this.data = {};
    this.seqID = 1;
    this.listeners = {};
  }

  /**
   * Get the value associated with a specific key. If that key has no value associated, `def` will
   * be returned.
   */
  get(key, def) {
    return this.data.hasOwnProperty(key) ? this.data[key] : def;
  }

  /**
   * Set a new value for the specified key. This will overwrite any previous data on that key.
   */
  set(key, val) {
    this.data[key] = val;
    this._notify(key, val);
  }

  /**
   * Update the data associated with the specified key. The key must have a previous
   * value of type object/array. If it's an object, the new value will be merged into the
   * old one. If it's array, the new value will just be appended.
   */
  update(key, val, notify) {
    if (!this.data.hasOwnProperty(key)) {
      throw new Error('Can\'t update `' + key + '` doesn\'t exist');
    }
    var currVal = this.data[key];
    if (!currVal || typeof currVal !== 'object') {
      throw new Error('Can\'t update `' + key + '` type isn\'t supported', key);
    }

    if (currVal instanceof Array) {
      val instanceof Array ? currVal.push.apply(currVal, val) : currVal.push(val);
    } else {
      mergeInto(currVal, val);
    }

    if (notify || typeof notify === 'undefined') {
      this._notify(key, currVal);
    }
  }

  listen(...args) {
    // pop() gets the last element in the array
    var callback = args.pop();

    if (args.length == 0) {
      args = [GLOBAL_KEY];
    }
    return this._attachListeners(args, callback);
  }

  _attachOneListener(cb, key) {
    if (!this.listeners[key]) {
      this.listeners[key] = {};
    }
    this.listeners[key][this.seqID] = cb;
    return this.seqID++;
  }

  _detachOneListener(key, seqID) {
    if (this.listeners[key] && this.listeners[key][seqID]) {
      delete this.listeners[key][seqID];
    }
  }

  _attachListeners(keys, cb) {
    return this._createRemovable(keys, keys.map(this._attachOneListener.bind(this, cb)));
  }

  _detachListeners(keys, seqIDs) {
    keys.forEach((key, ii) => this._detachOneListener(key, seqIDs[ii]));
  }

  _createRemovable(keys, seqIDs) {
    return {
      remove: this._detachListeners.bind(this, keys, seqIDs)
    };
  }

  _iterListeners(key, cb) {
    if (!this.listeners[key]) {
      return;
    }
    Object.keys(this.listeners[key])
      .forEach((seqID) => cb(this.listeners[key][seqID], seqID));
  }

  _notify(key, val) {
    if (this.listeners[key]) {
      this._iterListeners(key, listener => listener(val, key));
    }
    if (this.listeners[GLOBAL_KEY]) {
      this._iterListeners(GLOBAL_KEY, listener => listener(val, key));
    }
  }
};

var stores = {};
var StoreFactory = {
  create(name) {
    return stores[name] = new StoreClass(name);
  },
  get(name) {
    return stores[name];
  },
};

module.exports = {
  YoutubeStore: StoreFactory.create('YoutubeStore'),
  VideoCacheStore: StoreFactory.create('VideoCacheStore'),
};
