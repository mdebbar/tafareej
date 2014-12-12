var URL = require('./util/URL');
var X = require('./X');

function autocompleteCallback(callback, response) { // response == [query, results, other]
  callback(
    response[1].map(result => result[0])
  );
}

function errorHandler(err) {
  console.error(err);
}

function resultsCallback(callback, response) {
  callback(response.items);
}

function paginator(apiMethod, apiArg) {
  return function(response) {
    var pageToken = response.nextPageToken;
    this.next = function(callback) {
      if (!pageToken) {
        return false;
      }
      if (typeof apiArg !== 'undefined') {
        return API[apiMethod](apiArg, pageToken, callback);
      } else {
        return API[apiMethod](pageToken, callback);
      }
    };
  };
}

function logResponse(response) {
  var items = response.items;
  console.log(
    `Received ${items.length} items:`,
    items.map(item => item.id).join(',')
  );
}

var API = {
  /**
   * search(query, [pageToken], callback)
   */
  search(query, pageToken, callback) {
    if (typeof pageToken === 'function') {
      callback = pageToken;
      pageToken = null;
    }
    this._search && this._search.abandon();
    var url;
    if (pageToken == null) {
      console.log('Searching for:', query);
      url = URL.API.search(query);
    } else {
      console.log('Search page [' + pageToken + '] for:', query);
      url = URL.API.searchPage(query, pageToken);
    }
    return this._search = new X(url)
      .success(paginator('search', query))
      .success(logResponse)
      .success(resultsCallback.bind(null, callback))
      .error(errorHandler);
  },

  /**
   * related(videoID, [pageToken], callback)
   */
  related(videoID, pageToken, callback) {
    if (typeof pageToken === 'function') {
      callback = pageToken;
      pageToken = null;
    }
    this._related && this._related.abandon();
    var url;
    if (pageToken == null) {
      console.log('Related videos for:', videoID);
      url = URL.API.related(videoID);
    } else {
      console.log('Related videos page[' + pageToken + '] for:', videoID);
      url = URL.API.relatedPage(videoID, pageToken);
    }
    return this._related = new X(url)
      .success(paginator('related', videoID))
      .success(logResponse)
      .success(resultsCallback.bind(null, callback))
      .error(errorHandler);
  },

  /**
   * popular([pageToken], callback)
   */
  popular(pageToken, callback) {
    if (typeof pageToken === 'function') {
      callback = pageToken;
      pageToken = null;
    }
    this._popular && this._popular.abandon();
    var url;
    if (pageToken == null) {
      console.log('Popular videos');
      url = URL.API.popular();
    } else {
      console.log('Popular videos page[' + pageToken + ']');
      url = URL.API.popularPage(pageToken);
    }
    return this._popular = new X(url)
      .success(paginator('popular'))
      .success(logResponse)
      .success(resultsCallback.bind(null, callback))
      .error(errorHandler);
  },

  one(videoID, callback) {
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
  oneAndRelated(videoID) {
    // TODO: implement this so we fetch both the video's details and suggestions in one request
  },

  autocomplete(query, callback) {
    this._autocomplete && this._autocomplete.abandon();
    console.log('autocomplete:', query);
    this._autocomplete =
      new X(URL.API.autocomplete(query))
        .success(autocompleteCallback.bind(null, callback))
        .error(errorHandler);
    return this._autocomplete;
  },
};

module.exports = API;
