(function(global) {

  var data = {};
  var seqID = 1;
  var listeners = {};
  var GLOBAL_KEY = '*';

  function attachOneListener(cb, key) {
    if (!listeners[key]) {
      listeners[key] = {};
    }
    listeners[key][seqID] = cb;
    return seqID++;
  }

  function detachOneListener(key, seqID) {
    if (listeners[key] && listeners[key][seqID]) {
      delete listeners[key][seqID];
    }
  }

  function attachListeners(keys, cb) {
    return createRemover(keys, keys.map(attachOneListener.bind(null, cb)));
  }

  function detachListeners(keys, seqIDs) {
    keys.forEach(function(key, ii) {
      detachOneListener(key, seqIDs[ii]);
    });
  }

  function createRemover(keys, seqIDs) {
    return {
      remove: detachListeners.bind(null, keys, seqIDs)
    };
  }

  function iterListeners(key, cb) {
    if (!listeners[key]) {
      return;
    }
    for (var seqID in listeners[key]) {
      if (listeners[key].hasOwnProperty(seqID)) {
        cb(listeners[key][seqID], seqID);
      }
    }
  }

  global.Store = {

    get: function(key, def) {
      return data.hasOwnProperty(key) ? data[key] : def;
    },

    /**
     * Set a new value for the specified key. This will overwrite any previous data on that key.
     */
    set: function(key, val) {
      data[key] = val;
      this._notify(key, val);
    },

    /**
     * Update the data associated with the specified key. The key must have a previous
     * value of type object/array. If it's an object, the new value will be merged into the
     * old one. If it's array, the new value will just be appended.
     */
    update: function(key, val, notify) {
      if (!data.hasOwnProperty(key)) {
        throw new Error('Can\'t update `' + key + '` doesn\'t exist');
      }
      var currVal = data[key];
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
      return attachListeners(keys, callback);
    },

    _notify: function(key, val) {
      if (listeners[key]) {
        iterListeners(key, function(listener) {
          listener(val, key);
        });
      }
      if (listeners[GLOBAL_KEY]) {
        iterListeners(GLOBAL_KEY, function(listener) {
          listener(val, key);
        });
      }
    }

  };

})(this);
