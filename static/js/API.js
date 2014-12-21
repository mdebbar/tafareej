var Actions = require('./flux/Actions');
var URL = require('./util/URL');

var rest = require('rest');
var interceptor = require('rest/interceptor');
var mime = require('rest/interceptor/mime');

var client = rest.wrap(mime);


function logResponse(response) {
  console.log(`Received ${response.items.length} items`);
  return response;
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
    return client(url)
      .entity()
      .then(logResponse)
      .then((response) => Actions.receiveSearchVideos(query, response));
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
    return client(url)
      .entity()
      .then(logResponse)
      .then((response) => Actions.receiveRelatedVideos(videoID, response));
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
    return client(url)
      .entity()
      .then(logResponse)
      .then((response) => Actions.receivePopularVideos(response));
  },

  one(videoID) {
    console.log('Getting info for:', videoID);
    return client(URL.API.video(videoID))
      .entity()
      .then((video) => Actions.receiveVideoData(video));
  },

  /**
   * This returns 2 pieces of data in one call:
   * 1. Info about the video in question.
   * 2. Related videos.
   */
  oneAndRelated(videoID) {
    // TODO: implement this so we fetch both the video's details and suggestions in one request
  },
};

module.exports = API;
