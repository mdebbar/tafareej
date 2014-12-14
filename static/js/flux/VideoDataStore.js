var ActionTypes = require('./Actions').Types;
var BaseStore = require('./BaseStore');


class VideoDataStore extends BaseStore {

  constructor() {
    super();
    this.videos = {};
  }

  getAllVideos(): Object {
    return this.videos;
  }

  getVideoByID(videoID: string): ?Object {
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
    this.videos[video.id] = video;
  }
}

module.exports = new VideoDataStore();
