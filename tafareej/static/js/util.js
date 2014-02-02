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

var rtlRegex = new RegExp(
  '^[^' +
  // LTR chars
    'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF' +
  ']*[' +
  // RTL chars
    '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC' +
  ']'
);
function isRTL(s) {
  return rtlRegex.test(s);
}

function markDirection(elem) {
  var $elem = elem instanceof $ ? elem : $(elem);
  var text = $elem.val() || $elem.text();
  $elem.removeClass('rtl');
  isRTL(text) && $elem.addClass('rtl');
}

if (React) {
  ReactSimple = function(a, b) {
    var propTypes;
    var render;
    if (typeof a === 'function') {
      render = a;
      propTypes = b || {};
    } else if (typeof b === 'function') {
      render = b;
      propTypes = a || {};
    } else {
      throw new Error('A simple React component must have at least a render()');
    }
    return React.createClass({
      propTypes: propTypes,
      render: render
    });
  }
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
