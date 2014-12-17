var EventEmitter = require('events');
var SubscriptionReleaser = require('../util/SubscriptionReleaser');
var URL = require('./URL');

var loadScript = require('./loadScript');

var LOADED_EVENT = 'loaded';
var Status = {
  NONE: null,
  LOADING: '__loading__',
  LOADED: '__loaded__',
};

class YoutubeAPILoader extends EventEmitter {

  load(fn) {
    if (this.status == Status.NONE) {
      // This must be global because the Youtube API needs to call it.
      window.onYouTubeIframeAPIReady = this.loaded.bind(this);
      loadScript(URL.youtubePlayer('ytplayer'));
      this.status = Status.LOADING;
    } else if (this.status == Status.LOADED) {
      setTimeout(() => this.emit(), 0);
    }

    this.once(LOADED_EVENT, fn);
    return new SubscriptionReleaser(this, LOADED_EVENT, fn);
  }

  loaded() {
    this.status = Status.LOADED;
    this.YT = YT;
    this.emit();
  }

  emit() {
    super.emit(LOADED_EVENT, this.YT);
  }
}

module.exports = new YoutubeAPILoader();
