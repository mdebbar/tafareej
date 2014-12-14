var Map = require('../util/Map');
var TafareejDispatcher = require('./TafareejDispatcher');

var ActionTypes = Map.keyMirror({
  RECEIVE_VIDEO_DATA:     null,
  RECEIVE_SEARCH_VIDEOS: null,
  RECEIVE_RELATED_VIDEOS: null,
  RECEIVE_POPULAR_VIDEOS: null,
});


module.exports = {
  Types: ActionTypes,

  receiveVideoData(video: Object) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_VIDEO_DATA,
      video: video,
    });
  },

  receiveSearchVideos(query: string, videos: Array<Object>) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_SEARCH_VIDEOS,
      query: query,
      videos: videos,
    });
  },

  receiveRelatedVideos(videoID: string, videos: Array<Object>) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_RELATED_VIDEOS,
      videoID: videoID,
      videos: videos,
    });
  },

  receivePopularVideos(videos: Array<Object>) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_POPULAR_VIDEOS,
      videos: videos,
    });
  },
};
