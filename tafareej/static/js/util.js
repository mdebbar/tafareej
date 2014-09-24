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

function throttle(func, delay) {
  var timer, that, args;
  var throttled = function() {
    that = this;
    args = arguments;
    if (timer) return;
    timer = setTimeout(function() {
      timer = null;
      func.apply(that, args);
    }, delay);
  };
  throttled.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };
  return throttled;
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


function URI(url, params) {
  this.uri = url || window.location.href;
  this.params = params || {};
  // Parse the query string into params
  var idx = this.uri.indexOf('?');
  if (idx != -1) {
    this.params = merge(
      this._parseQueryString(this.uri.substr(idx + 1)),
      this.params
    );
    this.uri = this.uri.substr(0, idx);
  }
}

URI.prototype = {
  _parseQueryString: function(queryString) {
    var params = {};
    queryString.split('&').forEach(function(item) {
      var split = item.split('=');
      if (split.length != 2) { return; }
      params[split[0]] = split[1].replace(/\+/g, ' ');
    });
    return params;
  },
  _buildQueryString: function() {
    return Object.keys(this.params).map(function(name) {
      return name + '=' + (this.params[name] || '');
    }, this).join('&');
  },
  getParam: function(name, def) {
    if (name in this.params) {
      return this.decode(this.params[name]);
    }
    return def;
  },
  setParam: function(name, value) {
    if (typeof value == 'number') {
      value = String(value);
    }
    value = String(value || '');
    this.params[name] = this.encode(value);
    return this;
  },
  setParams: function(params) {
    Object.keys(params).forEach(function(name) {
      this.setParam(name, params[name]);
    }, this);
    return this;
  },
  removeParam: function(name) {
    if (name in this.params) {
      delete this.params[name];
    }
    return this;
  },
  clearParams: function() {
    this.params = {};
    return this;
  },
  encode: function(value) {
    return encodeURIComponent(value);
  },
  decode: function(value) {
    return decodeURIComponent(value.replace('+', ' '));
  },
  toString: function() {
    var queryString = this._buildQueryString();
    if (queryString) {
      return this.uri + '?' + queryString;
    }
    return this.uri;
  },
  go: function() {
    // TODO: Implement this to work well with HistoryManager
  }
};


