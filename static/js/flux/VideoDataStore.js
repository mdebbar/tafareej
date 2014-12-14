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

  onDispatch({action}): boolean {
    switch (action.type) {
      case ActionTypes.RECEIVE_VIDEOS:
        if (!action.videos || action.videos.length === 0) {
          return;
        }

        //mergeInto(
        //  this.videos,
        //  x(action.videos).map(v => [v.id, v]).zip()
        //);
        action.videos.forEach(video => {
          this.videos[video.id] = video;
        });
        return true;
    }
  }
}

module.exports = new VideoDataStore();
