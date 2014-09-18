(function(global) {

  var GLOBAL_KEY = '*';

  function StoreClass(name) {
    this.name = name;
    this.data = {};
    this.seqID = 1;
    this.listeners = {};
  }

  StoreClass.prototype = {
    /**
     * Get the value associated with a specific key. If that key has no value associated, `def` will
     * be returned.
     */
    get: function(key, def) {
      return this.data.hasOwnProperty(key) ? this.data[key] : def;
    },
    /**
     * Set a new value for the specified key. This will overwrite any previous data on that key.
     */
    set: function(key, val) {
      this.data[key] = val;
      this._notify(key, val);
    },
    /**
     * Update the data associated with the specified key. The key must have a previous
     * value of type object/array. If it's an object, the new value will be merged into the
     * old one. If it's array, the new value will just be appended.
     */
    update: function(key, val, notify) {
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
    },
    listen: function(/*args..., callback*/) {
      // pop() gets the last element in the array
      var callback = Array.prototype.pop.call(arguments);
      var keys = Array.prototype.slice.call(arguments, 0);
      
      if (keys.length == 0) {
        keys = [GLOBAL_KEY];
      }
      return this._attachListeners(keys, callback);
    },
    _attachOneListener: function(cb, key) {
      if (!this.listeners[key]) {
        this.listeners[key] = {};
      }
      this.listeners[key][this.seqID] = cb;
      return this.seqID++;
    },
    _detachOneListener: function(key, seqID) {
      if (this.listeners[key] && this.listeners[key][seqID]) {
        delete this.listeners[key][seqID];
      }
    },
    _attachListeners: function(keys, cb) {
      return this._createRemovable(keys, keys.map(this._attachOneListener.bind(this, cb)));
    },
    _detachListeners: function(keys, seqIDs) {
      keys.forEach(function(key, ii) {
        this._detachOneListener(key, seqIDs[ii]);
      }, this);
    },
    _createRemovable: function(keys, seqIDs) {
      return {
        remove: this._detachListeners.bind(this, keys, seqIDs)
      };
    },
    _iterListeners: function(key, cb) {
      if (!this.listeners[key]) {
        return;
      }
      for (var seqID in this.listeners[key]) {
        if (this.listeners[key].hasOwnProperty(seqID)) {
          cb(this.listeners[key][seqID], seqID);
        }
      }
    },
    _notify: function(key, val) {
      if (this.listeners[key]) {
        this._iterListeners(key, function(listener) {
          listener(val, key);
        });
      }
      if (this.listeners[GLOBAL_KEY]) {
        this._iterListeners(GLOBAL_KEY, function(listener) {
          listener(val, key);
        });
      }
    }
  };

  var stores = {};
  var StoreFactory = {
    create: function(name) {
      return stores[name] = new StoreClass(name);
    },
    get: function(name) {
      return stores[name];
    }
  };

  global.YoutubeStore = StoreFactory.create('YoutubeStore');
  global.VideoStore = StoreFactory.create('VideoStore');
  global.VideoCacheStore = StoreFactory.create('VideoCacheStore');

})(this);
