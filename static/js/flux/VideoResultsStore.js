var ActionTypes = require('./Actions').Types;
var BaseStore = require('./BaseStore');

class VideoResultsStore extends BaseStore {
  constructor() {
    super();
    // List of  popular video IDs.
    this.popularVideos = null;
    // Maps queries to lists of result IDs.
    this.searchCache = {};
    // Maps video IDs to lists of related video IDs.
    this.relatedCache = {};
  }

  getPopularVideos(): Array<number> {
    return this.popularVideos;
  }

  getSearchVideos(query: string): ?Array<number> {
    return this.searchCache[query];
  }

  getRelatedVideos(videoID: string): ?Array<number> {
    return this.relatedCache[videoID];
  }

  onDispatch({action}): ?boolean {
    switch (action.type) {

      case ActionTypes.RECEIVE_POPULAR_VIDEOS:
        var {videos} = action;
        if (!videos || videos.length === 0) {
          return;
        }

        // Maybe check for duplictes?
        this._cache(this, 'popularVideos', videos);
        return true;

      case ActionTypes.RECEIVE_SEARCH_VIDEOS:
        var {query, videos} = action;
        if (!videos || videos.length === 0) {
          return;
        }

        // Maybe check for duplictes?
        this._cache(this.searchCache, query, videos);
        return true;

      case ActionTypes.RECEIVE_RELATED_VIDEOS:
        var {videoID, videos} = action;
        if (!videos || videos.length === 0) {
          return;
        }

        // Maybe check for duplictes?
        this._cache(this.relatedCache, videoID, videos);
        return true;
    }
  }

  _cache(cache: Object, key: string, videos: Array<Object>) {
    cache[key] = cache[key] || [];
    Array.prototype.push.apply(
      cache[key],
      videos.map(video => video.id)
    );
  }
}

module.exports = new VideoResultsStore();
