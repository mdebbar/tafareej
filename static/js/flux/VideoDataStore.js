var ActionTypes = require('./Actions').Types;
var API = require('../API');
var BaseStore = require('./BaseStore');
var Immutable = require('immutable');

var Status = {
  NONE: null,
  PENDING: '__pending__',
  DONE: '__done__',
};

class VideoDataStore extends BaseStore {

  constructor() {
    super();

    // Maps video IDs to video data.
    this.videos = {};

    /**
     * Maps video IDs to their status. Possible statuses:
     * - Status.NONE: not requested yet.
     * - Status.PENDING: the video is being fetched.
     * - Status.DONE: the video has been fetched.
     */
    this.status = {};
  }

  getAllVideos(): Object {
    return this.videos;
  }

  getVideoByID(videoID: string): Immutable.Map<string, any> {
    if (this.status[videoID] == Status.NONE) {
      // Fetch data for the video.
      setTimeout(() => API.one(videoID), 0);
      this.status[videoID] = Status.PENDING;
    }
    if (!this.videos[videoID]) {
      // Put temporary video data in place.
      this.videos[videoID] = Immutable.Map({
        id: videoID,
        uri: `/yt/${videoID}/`,
      });
    }
    return this.videos[videoID];
  }

  onDispatch({action}): ?boolean {
    switch (action.type) {

      case ActionTypes.RECEIVE_VIDEO_DATA:
        this._addVideo(action.video);
        return true;

      case ActionTypes.RECEIVE_POPULAR_VIDEOS:
      case ActionTypes.RECEIVE_SEARCH_VIDEOS:
      case ActionTypes.RECEIVE_RELATED_VIDEOS:
        var {videos} = action;
        if (!videos || videos.length === 0) {
          return;
        }

        //mergeInto(
        //  this.videos,
        //  x(videos).map(v => [v.id, v]).zip()
        //);
        videos.forEach(video => this._addVideo(video));
        return true;
    }
  }

  _addVideo(video: Object) {
    this.videos[video.id] = Immutable.Map(video);
    this.status[video.id] = Status.DONE;
  }
}

module.exports = new VideoDataStore();
