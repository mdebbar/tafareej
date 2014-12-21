var Map = require('../util/Map');
var TafareejDispatcher = require('./TafareejDispatcher');

var ActionTypes = Map.keyMirror({
  RECEIVE_VIDEO_DATA:     null,
  RECEIVE_SEARCH_VIDEOS: null,
  RECEIVE_RELATED_VIDEOS: null,
  RECEIVE_POPULAR_VIDEOS: null,
});

type Response = {items: Array<Object>; nextPageToken: ?string};


module.exports = {
  Types: ActionTypes,

  receiveVideoData(video: Object) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_VIDEO_DATA,
      video: video,
    });
  },

  receiveSearchVideos(query: string, response: Response) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_SEARCH_VIDEOS,
      query: query,
      videos: response.items,
      nextPageToken: response.nextPageToken,
    });
  },

  receiveRelatedVideos(videoID: string, response: Response) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_RELATED_VIDEOS,
      videoID: videoID,
      videos: response.items,
      nextPageToken: response.nextPageToken,
    });
  },

  receivePopularVideos(response: Response) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_POPULAR_VIDEOS,
      videos: response.items,
      nextPageToken: response.nextPageToken,
    });
  },
};
