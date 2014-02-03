(function(global) {

  const SEARCH_URL  = '/api/search/__query__/';
  const RELATED_URL = '/api/related/__video_id__/';
  const ONE_URL     = '/api/__video_id__/';

  function searchResults(response) {
    Store.set('search_results', response);
  }

  function relatedResults(response) {
    Store.set('related_videos', response);
  }

  function errorHandler(err) {
    console.error(err);
  }

  const CLEAN_REGEX = /\s+/g;
  function cleanQuery(query) {
    return query.trim().replace(CLEAN_REGEX, ' ');
  }

  global.API = {
    search: function(query) {
      query = cleanQuery(query);
      console.log('Searching for:', query);
      this._search && this._search.abandon();
      this._search = new X(SEARCH_URL.replace('__query__', query))
        .success(searchResults)
        .error(errorHandler)
    },
    related: function(videoID) {
      console.log('Getting related videos for:', videoID);
      this._related && this._related.abandon();
      this._related = new X(RELATED_URL.replace('__video_id__', videoID))
        .success(relatedResults)
        .error(errorHandler)
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
