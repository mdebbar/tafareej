var merge = require('./merge');


class URI {

  constructor(url, params) {
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

  _parseQueryString(queryString) {
    var params = {};
    queryString.split('&').forEach(function(item) {
      var split = item.split('=');
      if (split.length !== 2) {
        return;
      }
      params[split[0]] = split[1].replace(/\+/g, ' ');
    });
    return params;
  }

  _buildQueryString() {
    return Object.keys(this.params).map(
      name => name + '=' + (this.params[name] || '')
    ).join('&');
  }

  getParam(name, def) {
    if (name in this.params) {
      return this.decode(this.params[name]);
    }
    return def;
  }

  getParams() {
    return this.params;
  }

  setParam(name, value) {
    if (typeof value == 'number') {
      value = String(value);
    }
    value = String(value || '');
    this.params[name] = this.encode(value);
    return this;
  }

  setParams(params) {
    Object.keys(params).forEach(name => this.setParam(name, params[name]));
    return this;
  }

  removeParam(name) {
    if (name in this.params) {
      delete this.params[name];
    }
    return this;
  }

  clearParams() {
    this.params = {};
    return this;
  }

  encode(value) {
    return encodeURIComponent(value);
  }

  decode(value) {
    return decodeURIComponent(value.replace('+', ' '));
  }

  toString() {
    var queryString = this._buildQueryString();
    if (queryString) {
      return `${this.uri}?${queryString}`;
    }
    return this.uri;
  }

  go() {
    // TODO: Implement this to work well with HistoryManager
  }
}

module.exports = URI;
