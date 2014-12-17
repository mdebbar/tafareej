var Actions = require('./flux/Actions');
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

function logResponse({items}) {
  console.log(
    `Received ${items.length} items`
  );
}


var API = {
  search(query, pageToken) {
    var url;
    if (pageToken == null) {
      console.log('Searching for:', query);
      url = URL.API.search(query);
    } else {
      console.log('Search page [' + pageToken + '] for:', query);
      url = URL.API.searchPage(query, pageToken);
    }
    return new X(url)
      .success(logResponse)
      .success((response) => Actions.receiveSearchVideos(query, response))
      .error(errorHandler);
  },

  related(videoID, pageToken) {
    var url;
    if (pageToken == null) {
      console.log('Related videos for:', videoID);
      url = URL.API.related(videoID);
    } else {
      console.log('Related videos page[' + pageToken + '] for:', videoID);
      url = URL.API.relatedPage(videoID, pageToken);
    }
    return new X(url)
      .success(logResponse)
      .success((response) => Actions.receiveRelatedVideos(videoID, response))
      .error(errorHandler);
  },

  popular(pageToken) {
    var url;
    if (pageToken == null) {
      console.log('Popular videos');
      url = URL.API.popular();
    } else {
      console.log('Popular videos page[' + pageToken + ']');
      url = URL.API.popularPage(pageToken);
    }
    return new X(url)
      .success(logResponse)
      .success((response) => Actions.receivePopularVideos(response))
      .error(errorHandler);
  },

  one(videoID) {
    console.log('Getting info for:', videoID);
    return new X(URL.API.video(videoID))
      .success((video) => Actions.receiveVideoData(video))
      .error(errorHandler);
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
