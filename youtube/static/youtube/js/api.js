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

  function paginate(api, query, response) {
    api.next = function(callback) {
      if (!response.nextPageToken) {
        return false;
      }
      API.searchPage(query, response.nextPageToken, callback);
      return true;
    };
  }

  global.API = {
    search: function(query, callback) {
      query = cleanQuery(query);
      console.log('Searching for:', query);
      this._search && this._search.abandon();
      this._search = new X(URL.API.search(query));
      this._search.success(paginate.bind(null, this._search, query))
                  .success(resultsCallback.bind(null, callback))
                  .error(errorHandler);
      return this._search;
    },
    searchPage: function(query, pageToken, callback) {
      query = cleanQuery(query);
      console.log('Search page [' + pageToken + '] for:', query);
      this._search && this._search.abandon();
      this._search = new X(URL.API.searchPage(query, pageToken));
      this._search.success(paginate.bind(null, this._search, query))
                  .success(resultsCallback.bind(null, callback))
                  .error(errorHandler);
      return this._search;
    },
    related: function(videoID, callback) {
      console.log('Getting related videos for:', videoID);
      this._related && this._related.abandon();
      this._related = new X(URL.API.related(videoID));
      // TODO: paginate doesn't work here.
      this._related.success(paginate.bind(null, this._related, videoID))
                   .success(resultsCallback.bind(null, callback))
                   .error(errorHandler);
      return this._related;
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
      // TODO: implement this
    }
  };
})(this);
