(function(global) {

  function errorHandler(err) {
    console.error(err);
  }

  const CLEAN_REGEX = /\s+/g;
  function cleanQuery(query) {
    return query.trim().replace(CLEAN_REGEX, ' ');
  }

  function resultsCallback(callback, response) {
    callback(response.items);
  }

  function paginator(query, apiMethod) {
    return function(response) {
      var pageToken = response.nextPageToken;
      this.next = function(callback) {
        if (!pageToken) {
          return false;
        }
        return API[apiMethod](query, pageToken, callback);
      };
    };
  }

  global.API = {
    // TODO: refactor search() <=> searchPage() AND related() <=> relatedPage()
    search: function(query, callback) {
      query = cleanQuery(query);
      console.log('Searching for:', query);
      this._search && this._search.abandon();
      return this._search = new X(URL.API.search(query))
        .success(paginator(query, 'searchPage'))
        .success(resultsCallback.bind(null, callback))
        .error(errorHandler);
    },
    searchPage: function(query, pageToken, callback) {
      console.log('Search page [' + pageToken + '] for:', query);
      this._search && this._search.abandon();
      return this._search = new X(URL.API.searchPage(query, pageToken))
        .success(paginator(query, 'searchPage'))
        .success(resultsCallback.bind(null, callback))
        .error(errorHandler);
    },
    related: function(videoID, callback) {
      console.log('Related videos for:', videoID);
      this._related && this._related.abandon();
      return this._related = new X(URL.API.related(videoID))
        .success(paginator(videoID, 'relatedPage'))
        .success(resultsCallback.bind(null, callback))
        .error(errorHandler);
    },
    relatedPage: function(videoID, pageToken, callback) {
      console.log('Related videos page[' + pageToken + '] for:', videoID);
      this._related && this._related.abandon();
      return this._related = new X(URL.API.relatedPage(videoID, pageToken))
        .success(paginator(videoID, 'relatedPage'))
        .success(resultsCallback.bind(null, callback))
        .error(errorHandler);
    },
    one: function(videoID, callback) {
      console.log('Getting info for:', videoID);
      this._one && this._one.abandon();
      this._one = new X(URL.API.video(videoID))
        .success(callback)
        .error(errorHandler);
      return this._one;
    },
    /**
     * This returns 2 pieces of data in one call:
     * 1. Info about the video in question.
     * 2. Related videos.
     */
    oneAndRelated: function(videoID) {
      // TODO: implement this so we fetch both the video's details and suggestions in one request
    }
  };
})(this);
