(function(global) {

  const SEARCH_URL  = '/api/search/__query__/';
  const RELATED_URL = '/api/related/__video_id__/';
  const ONE_URL     = '/api/__video_id__/';

  function errorHandler(err) {
    console.error(err);
  }

  const CLEAN_REGEX = /\s+/g;
  function cleanQuery(query) {
    return query.trim().replace(CLEAN_REGEX, ' ');
  }

  global.API = {
    search: function(query, callback) {
      query = cleanQuery(query);
      console.log('Searching for:', query);
      this._search && this._search.abandon();
      this._search = new X(SEARCH_URL.replace('__query__', query))
        .success(callback)
        .error(errorHandler);
      return this._search;
    },
    related: function(videoID, callback) {
      console.log('Getting related videos for:', videoID);
      this._related && this._related.abandon();
      this._related = new X(RELATED_URL.replace('__video_id__', videoID))
        .success(callback)
        .error(errorHandler);
      return this._related;
    },
    one: function(videoID, callback) {
      console.log('Getting info for:', videoID);
      this._one && this._one.abandon();
      this._one = new X(ONE_URL.replace('__video_id__', videoID))
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
