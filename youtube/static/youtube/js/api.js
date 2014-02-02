(function(global) {

  const SEARCH_URL  = '/api/search/:query:/';
  const RELATED_URL = '/api/related/:video_id:/';
  const ONE_URL     = '/api/:video_id:/';

  function searchResults(response) {
    Store.set('search_results', response);
  }

  function relatedResults(response) {

  }

  function errorHandler(err) {
    console.error(err);
  }

  function Q(/* url,[data],[options],[before] */) {
    this.active = true;
    qwest.get.apply(qwest, arguments)
      .success(this.onSuccess.bind(this))
      .error(this.onError.bind(this))
      .complete(this.onComplete.bind(this));
  }

  Q.prototype = {
    success: function(func) {
      this.active && (this._success = func);
      return this;
    },
    error: function(func) {
      this.active && (this._error = func);
      return this;
    },
    complete: function(func) {
      this.active && (this._complete = func);
      return this;
    },

    onSuccess: function() {
      this._success && this._success.apply(null, arguments);
    },
    onError: function() {
      this._error && this._error.apply(null, arguments);
    },
    onComplete: function() {
      this._complete && this._complete.apply(null, arguments);
    },

    cancel: function() {
      this.active = false;
      delete this._success;
      delete this._error;
      delete this._complete;
    }
  };

  global.API = {
    search: function(query) {
      console.log('Searching for:', query);
      this._search && this._search.cancel();
      this._search = new Q(SEARCH_URL.replace(':query:', query), {json: 1}, {cache: true})
        .success(searchResults)
        .error(errorHandler)
    },
    related: function(videoID) {
      console.log('Getting related videos for:', videoID);
    },
    one: function(videoID) {
      console.log('Getting info for:', videoID);
    },
    /**
     * This returns 2 pieces of data in one call:
     * 1. Info about the video in question.
     * 2. Related videos.
     */
    oneAndRelated: function(videoID) {

    }
  };
})(this);
