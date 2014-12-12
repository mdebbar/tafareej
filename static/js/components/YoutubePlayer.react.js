// CSS
require('../../css/player.css');

var CSS = require('../util/CSS');
var React = require('react');
var Spinner = require('./Spinner.react');
var URL = require('../util/URL');
var X = require('../X');
var YoutubeStore = require('../Stores').YoutubeStore;

var PLAYER_ID = 'ytplayer';

var seqID = 0;

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
  propTypes: {
    autoplay: React.PropTypes.bool,
    theme: React.PropTypes.oneOf(['dark', 'light']),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    videoID: React.PropTypes.string.isRequired,
    onSwitchVideo: React.PropTypes.func,
    // Player events:
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onBuffering: React.PropTypes.func,
    onEnd: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      autoplay: true,
      theme: 'dark',
      width: 640,
      height: 390,
      onSwitchVideo: () => {},
    };
  },

  componentWillMount() {
    this.playerID = PLAYER_ID + String(seqID++);
    this.playerLoader = loadYoutubePlayer();
  },

  componentDidMount() {
    if (YoutubeStore.get('api.ready')) {
      this._onYoutubeAPIReady();
    } else {
      this._listener = YoutubeStore.listen('api.ready', this._onYoutubeAPIReady);
    }
  },

  componentWillUnmount() {
    this._listener && this._listener.remove();
    this.playerLoader && this.playerLoader.abandon();
    this.player && this.player.destroy();
  },

  componentWillReceiveProps({videoID}) {
    if (this.player.getVideoData().video_id !== videoID) {
      // If it's a different video => stop current video + load the new one!
      // (loading will automatically play the video)
      this.player.stopVideo();
      this.player.loadVideoById(videoID);
    }
  },

  play() {
    this.player && this.player.playVideo();
  },

  pause() {
    this.player && this.player.pauseVideo();
  },

  mute() {
    this.player && this.player.mute();
  },

  unMute() {
    this.player && this.player.unMute();
  },

  render() {
    var {autoplay, videoID, width, height, theme, className, ...other} = this.props;
    return (
      <Spinner
        {...other}
        id={this.playerID}
        className={CSS.join(className, 'youtube-player')}
      />
    );
  },

  _onYoutubeAPIReady() {
    var {autoplay, videoID, width, height, theme} = this.props;
    this.player = new YT.Player(this.playerID, {
      width: String(width),
      height: String(height),
      videoId: videoID,
      playerVars: {
        // `autoplay` only accepts 1 or 0
        autoplay: autoplay ? 1 : 0,
        theme: theme,
      },
      events: {
        onStateChange: this._onPlayerStateChange,
      },
    });
  },

  _onPlayerStateChange(event) {
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
  },
});

module.exports = YoutubePlayer;
