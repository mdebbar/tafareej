var Map = require('../util/Map');
var TafareejDispatcher = require('./TafareejDispatcher');

var ActionTypes = Map.keyMirror({
  RECEIVE_VIDEOS: null,
});


module.exports = {
  Types: ActionTypes,

  receiveVideos(videos) {
    TafareejDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_VIDEOS,
      videos: videos,
    });
  },
};
