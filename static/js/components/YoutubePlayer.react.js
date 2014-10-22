/** @jsx React.DOM */

// CSS
require('../../css/player.css');

var React = require('React');
var Spinner = require('./Spinner.react');
var URL = require('../util/URL');
var X = require('../X');
var YoutubeStore = require('../Stores').YoutubeStore;

const PLAYER_ID = 'ytplayer';

var seqID = 0;
var PropTypes = React.PropTypes;

var loaded = false;
function loadYoutubePlayer() {
  if (loaded) {
    return;
  }
  loaded = true;
  return new X(URL.youtubePlayer('ytplayer')).jsonp();
}

// This must be global because the Youtube API needs to call it.
window.onYouTubeIframeAPIReady = YoutubeStore.set.bind(YoutubeStore, 'api.ready', true);

var YoutubePlayer = React.createClass({
  displayName: 'YoutubePlayer',
  propTypes: {
    autoplay: PropTypes.bool,
    theme: PropTypes.oneOf(['dark', 'light']),
    width: PropTypes.number,
    height: PropTypes.number,
    videoID: PropTypes.string.isRequired,
    onSwitchVideo: PropTypes.func,
    // Player events:
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onBuffering: PropTypes.func,
    onEnd: PropTypes.func
  },
  getDefaultProps: function() {
    return {
      autoplay: true,
      theme: 'dark',
      width: 640,
      height: 390,
      onSwitchVideo: function() {}
    };
  },
  componentWillMount: function() {
    this.playerID = PLAYER_ID + String(seqID++);
    this.playerLoader = loadYoutubePlayer();
  },
  componentDidMount: function() {
    if (YoutubeStore.get('api.ready')) {
      this._onYoutubeAPIReady();
    } else {
      this._listener = YoutubeStore.listen('api.ready', this._onYoutubeAPIReady);
    }
  },
  componentWillUnmount: function() {
    this._listener && this._listener.remove();
    this.playerLoader && this.playerLoader.abandon();
    this.player && this.player.destroy();
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.player.getVideoData().video_id !== nextProps.videoID) {
      // If it's a different video => stop current video + load the new one!
      // (loading will automatically play the video)
      this.player.stopVideo();
      this.player.loadVideoById(nextProps.videoID);
    }
  },
  play: function() {
    this.player && this.player.playVideo();
  },
  pause: function() {
    this.player && this.player.pauseVideo();
  },
  mute: function() {
    this.player && this.player.mute();
  },
  unMute: function() {
    this.player && this.player.unMute();
  },
  render: function() {
    return this.transferPropsTo(
      <Spinner id={this.playerID} className="youtube-player" />
    );
  },
  _onYoutubeAPIReady: function() {
    // TODO: remove window.player, it's just for debugging purposes.
    window.player = this.player = new YT.Player(this.playerID, {
      width: String(this.props.width),
      height: String(this.props.height),
      videoId: this.props.videoID,
      playerVars: {
        // `autoplay` only accepts 1 or 0
        autoplay: this.props.autoplay ? 1 : 0,
        theme: this.props.theme
      },
      events: {
        onStateChange: this._onPlayerStateChange
      }
    });
  },
  _onPlayerStateChange: function(event) {
    // Respond to player events
    // Possible states: {UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5}
    switch (event.data) {
      case YT.PlayerState.UNSTARTED:
        var videoID = event.target.getVideoData().video_id;
        if (videoID !== this.props.videoID) {
          this.props.onSwitchVideo(videoID);
        }
        break;
      case YT.PlayerState.PLAYING:
        this.props.onPlay && this.props.onPlay();
        break;
      case YT.PlayerState.PAUSED:
        this.props.onPause && this.props.onPause();
        break;
      case YT.PlayerState.ENDED:
        this.props.onEnd && this.props.onEnd();
        break;
      case YT.PlayerState.BUFFERING:
        this.props.onBuffering && this.props.onBuffering();
        break;
    }
  }
});

module.exports = YoutubePlayer;
