var ActionTypes = require('./Actions').Types;
var API = require('../API');
var BaseStore = require('./BaseStore');
var Immutable = require('immutable');
var TafareejDispatcher = require('./TafareejDispatcher');
var VideoDataStore = require('./VideoDataStore');

var Status = {
  NONE: null,
  PENDING: '__pending__',
  NO_MORE: '__no_more__',
};

class VideoResultsStore extends BaseStore {
  constructor() {
    super();

    // A cache for the previously-fetched videos
    this.cache = {};

    // Status of different queries. The possible statuses are:
    // - Status.NONE: nothing has been requested yet.
    // - Status.PENDING: a request is in progress.
    // - Status.NO_MORE: we already fetched everything, there are no more videos to fetch.
    // - <pageToken>: a token that could be used to fetch the next page of videos.
    this.status = {};
  }

  getPopularVideos(offset: number, limit: number): Immutable.Seq<number> {
    return this._getFromCache('popular', offset, limit, (token) => {
      token === Status.NONE ? API.popular() : API.popular(token);
    });
  }

  getSearchVideos(query: string, offset: number, limit: number): Immutable.Seq<number> {
    return this._getFromCache(`search:${query}`, offset, limit, (token) => {
      token == Status.NONE ? API.search(query) : API.search(query, token);
    });
  }

  getRelatedVideos(videoID: string, offset: number, limit: number): ?Array<number> {
    return this._getFromCache(`related:${videoID}`, offset, limit, (token) => {
      token == Status.NONE ? API.related(videoID) : API.related(videoID, token);
    });
  }

  onDispatch({action}): ?boolean {
    // This is to make sure we store data for the videos before we store the list of IDs.
    // Otherwise, someone may get notified about a new list of IDs, but can't find the data
    // for them.
    TafareejDispatcher.waitFor([VideoDataStore.dispatchToken]);

    switch (action.type) {
      case ActionTypes.RECEIVE_POPULAR_VIDEOS:
        var {videos, nextPageToken} = action;
        if (!videos || videos.length === 0) {
          return;
        }
        return this._cache('popular', videos, nextPageToken);

      case ActionTypes.RECEIVE_SEARCH_VIDEOS:
        var {query, videos, nextPageToken} = action;
        if (!videos || videos.length === 0) {
          return;
        }
        return this._cache(`search:${query}`, videos, nextPageToken);

      case ActionTypes.RECEIVE_RELATED_VIDEOS:
        var {videoID, videos, nextPageToken} = action;
        if (!videos || videos.length === 0) {
          return;
        }
        return this._cache(`related:${videoID}`, videos, nextPageToken);
    }
  }

  _cache(key: string, videos: Array<Object>, nextPageToken?: string): boolean {
    // Maybe check for duplictes?
    this.cache[key] = (this.cache[key] || Immutable.Seq()).concat(videos.map(video => video.id));
    this.status[key] = nextPageToken || Status.NO_MORE;
    return true;
  }

  _getFromCache(key: string, offset: number, limit: number, miss: Function): Immutable.Seq<number> {
    this.cache[key] = this.cache[key] || Immutable.Seq();

    var entry = this.cache[key];
    var end = offset + limit;
    var status = this.status[key];
    if (end > entry.size && status !== Status.PENDING && status !== Status.NO_MORE) {
      // Fetch more
      setTimeout(() => miss(status), 0);
      this.status[key] = Status.PENDING;
    }
    return entry.slice(offset, end);
  }
}

module.exports = new VideoResultsStore();
