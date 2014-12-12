var merge = require('./util/merge');
var qwest = require('./3party/qwest');

const X_DEFAULT_DELAY = 0;
const DEFAULT_OPTIONS = {
  // this prevents qwest from adding the parameter "__t" to the url.
  cache: true
};

function toQueryString(data) {
  if (!data) {
    return '';
  }
  return Object.keys(data).map(
    (k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`
  ).join('&');
}

function buildURL(url, data) {
  var queryString = toQueryString(data);
  if (!queryString) {
    return url;
  }
  
  var middle = '';
  if (url.indexOf('?') === -1) {
    middle = '?';
  } else if (url[url.length - 1] !== '&') {
    middle = '&';
  }
  return `${url}${middle}${queryString}`;
}

function loadScript(url, data) {
  var tag = document.createElement('script');
  tag.src = buildURL(url, data);
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/**
 * A class used to send Ajax requests. It's sophisticated in many ways:
 * - It's a wrapper around Qwest and supports all its API.
 * - You can `abandon()` an X object, which mean the response from the request will be ignored.
 */
class X {
  constructor(url, data, options, before) {
    this.active = true;
    this.args = [url, data, merge(DEFAULT_OPTIONS, options), before];

    this._boundSend = this._send.bind(this);
    this._setTimer(X_DEFAULT_DELAY);

    this._success = [];
    this._error = [];
    this._complete = [];
  }

  _send() {
    if (!this._clearTimer()) {
      return;
    }

    if (this.method === 'jsonp') {
      loadScript(this.args[0], this.args[1]); // this.args[0,1] == [url,data]
    } else {
      qwest.get.apply(qwest, this.args)
        .success(this.onSuccess.bind(this))
        .error(this.onError.bind(this))
        .complete(this.onComplete.bind(this));
    }
  }

  _setTimer(delay) {
    this.timer = setTimeout(this._boundSend, delay);
  }

  _clearTimer() {
    if (!this.timer) {
      return false;
    }
    clearTimeout(this.timer);
    delete this.timer;
    return true;
  }

  jsonp() {
    this.method = 'jsonp';
    return this;
  }

  success(func) {
    this.active && (this._success.push(func));
    return this;
  }

  error(func) {
    this.active && (this._error.push(func));
    return this;
  }

  complete(func) {
    this.active && (this._complete.push(func));
    return this;
  }

  onSuccess(...args) {
    this._success.forEach(function(success) {
      success.apply(this, args);
    }, this);
  }

  onError(...args) {
    this._error && this._error.forEach(function(error) {
      error.apply(this, args);
    }, this);
  }

  onComplete(...args) {
    this._complete && this._complete.forEach(function(complete) {
      complete.apply(this, args);
    }, this);
  }

  /**
   * Delay sending the request if it wasn't sent already.
   * @return {boolean} Whether delaying the request was successful or not.
   */
  delay(amount) {
    if (this._clearTimer()) {
      this._setTimer(amount);
      return true;
    }
    return false;
  }

  /**
   * Abandoning the request will cause the response to be completely ignored. If the request hasn't
   * been sent yet, it will be cancelled.
   */
  abandon() {
    this.active = false;
    this._clearTimer();
    delete this._success;
    delete this._error;
    delete this._complete;
  }
};

module.exports = X;
