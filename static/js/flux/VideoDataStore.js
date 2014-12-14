var ActionTypes = require('./Actions').Types;
var EventEmitter = require('events');
var merge = require('../util/merge');
var TafareejDispatcher = require('./TafareejDispatcher');

var videos = {};

var VideoDataStore = merge(EventEmitter.prototype, {
  getAllVideos(): Object {
    return videos;
  },

  getVideoByID(videoID: string): ?Object {
    return videos[videoID];
  },
});

VideoDataStore.dispatchToken = TafareejDispatcher.register(function({action}) {
  switch (action.type) {
    case ActionTypes.RECEIVE_VIDEOS:
      if (!action.videos || action.videos.length === 0) {
        break;
      }
      action.videos.forEach(video => {
        videos[video.id] = video;
      });
      this.emit('change');
      break;
  }
}.bind(VideoDataStore));

window.debug__VideoDataStore = VideoDataStore;

module.exports = VideoDataStore;
