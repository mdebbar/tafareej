function emptyFunction() {}

/**
 * Merge the object b into a, and return a.
 */
function mergeInto(a, b) {
  for (var k in b) {
    if (b.hasOwnProperty(k)) {
      a[k] = b[k];
    }
  }
  return a;
}

function merge(a, b) {
  return mergeInto(mergeInto({}, a), b);
}

function debounce(func, delay) {
  var timer;
  var debounced = function() {
    var that = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(that, args);
    }, delay);
  };
  debounced.cancel = function() {
    clearTimeout(timer);
  };
  return debounced;
}

const COL_CLASS_PREFIXES = [
  // 'col-xs-',
  // 'col-sm-',
  'col-md-',
  'col-lg-'
];
function colClass(size) {
  return COL_CLASS_PREFIXES.map(function(prefix) {
    return prefix + String(size);
  }).join(' ');
}

function truncate(text, max, suffix) {
  suffix = suffix || '';
  if (!text) {
    return text;
  }
  return text.length > max ?
    text.slice(0, max) + suffix :
    text;
}

var Event = {
  _id: 0,
  _listeners: {},

  _removable: function(id) {
    var self = this;
    return {
      remove: function() {
        this.remove = function() {};
        delete self._listeners[event][id];
      }
    };
  },

  listen: function(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Event listeners should be only functions.');
    }
    var id = this._id++;
    this._listeners[event] = this._listeners[event] || {};
    this._listeners[event][id] = callback;
    return this._removable(id);
  },

  fire: function(event, data) {
    if (!this._listeners[event]) {
      return;
    }
    for (var id in this._listeners[event]) {
      if (this._listeners[event].hasOwnProperty(id)) {
        this._listeners[event][id](event, data);
      }
    }
  },

  hasListeners: function(event) {
    return event in this._listeners && Object.keys(this._listeners[event]).length;
  }
};
