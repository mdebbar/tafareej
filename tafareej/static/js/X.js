(function(global) {
  const X_DEFAULT_DELAY = 100;
  const DEFAULT_OPTIONS = {
    // this prevents qwest from adding the parameter "__t" to the url.
    cache: true
  };

  /**
   * A class used to send Ajax requests. It's sophisticated in many ways:
   * - It's a wrapper around Qwest and supports all its API.
   * - You can `abandon()` an X object, which mean the response from the request will be ignored.
   */
  global.X = function(url, data, options, before) {
    this.active = true;
    this.args = [url, data, merge(DEFAULT_OPTIONS, options), before];

    this._boundSend = this._send.bind(this);
    this._setTimer(X_DEFAULT_DELAY);

    this._success = [];
    this._error = [];
    this._complete = [];
  };

  global.X.prototype = {
    _send: function() {
      this._clearTimer() && qwest.get.apply(qwest, this.args)
        .success(this.onSuccess.bind(this))
        .error(this.onError.bind(this))
        .complete(this.onComplete.bind(this));
    },
    _setTimer: function(delay) {
      this.timer = setTimeout(this._boundSend, delay);
    },
    _clearTimer: function() {
      if (!this.timer) {
        return false;
      }
      clearTimeout(this.timer);
      delete this.timer;
      return true;
    },
    success: function(func) {
      this.active && (this._success.push(func));
      return this;
    },
    error: function(func) {
      this.active && (this._error.push(func));
      return this;
    },
    complete: function(func) {
      this.active && (this._complete.push(func));
      return this;
    },

    onSuccess: function() {
      var args = arguments;
      this._success.forEach(function(success) {
        success.apply(this, args);
      }, this);
    },
    onError: function() {
      var args = arguments;
      this._error && this._error.forEach(function(error) {
        error.apply(this, args);
      }, this);
    },
    onComplete: function() {
      var args = arguments;
      this._complete && this._complete.forEach(function(complete) {
        complete.apply(this, args);
      }, this);
    },

    /**
     * Delay sending the request if it wasn't sent already.
     * @return {boolean} Whether delaying the request was successful or not.
     */
    delay: function(amount) {
      if (this._clearTimer()) {
        this._setTimer(amount);
        return true;
      }
      return false;
    },

    /**
     * Abandoning the request will cause the response to be completely ignored. If the request hasn't
     * been sent yet, it will be cancelled.
     */
    abandon: function() {
      this.active = false;
      this._clearTimer();
      delete this._success;
      delete this._error;
      delete this._complete;
    }
  };
})(this);
