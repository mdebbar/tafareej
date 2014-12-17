// CSS
require('../../css/player.css');

var CSS = require('../util/CSS');
var React = require('react');
var Spinner = require('./Spinner.react');
var Subscriptions = require('../mixins/Subscriptions');
var URL = require('../util/URL');
var YoutubeAPILoader = require('../util/YoutubeAPILoader');

const PLAYER_ID = 'ytplayer';

var seqID = 0;

var YoutubePlayer = React.createClass({
  mixins: [Subscriptions],

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
  },

  getSubscriptions() {
    return [
      YoutubeAPILoader.load(this._onYoutubeAPIReady),
    ];
  },

  componentWillUnmount() {
    this.player && this.player.destroy();
  },

  componentWillReceiveProps({videoID}) {
    if (this.player) {
      this.maybeUpdatePlayer(videoID);
    }
  },

  maybeUpdatePlayer(videoID) {
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

  _onYoutubeAPIReady(YT) {
    if (!this.isMounted()) {
      return;
    }
    this.YT = YT;
    var {autoplay, videoID, width, height, theme} = this.props;
    new YT.Player(this.playerID, {
      width: String(width),
      height: String(height),
      videoId: videoID,
      playerVars: {
        // `autoplay` only accepts 1 or 0
        autoplay: autoplay ? 1 : 0,
        theme: theme,
      },
      events: {
        onReady: this._onPlayerReady,
        onStateChange: this._onPlayerStateChange,
      },
    });
  },

  _onPlayerReady(event) {
    if (!this.isMounted()) {
      return;
    }
    this.player = event.target;
    this.maybeUpdatePlayer(this.props.videoID);
  },

  _onPlayerStateChange(event) {
    // Respond to player events
    // Possible states: {UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5}
    switch (event.data) {
      case this.YT.PlayerState.UNSTARTED:
        var videoID = event.target.getVideoData().video_id;
        if (videoID !== this.props.videoID) {
          this.props.onSwitchVideo(videoID);
        }
        break;
      case this.YT.PlayerState.PLAYING:
        this.props.onPlay && this.props.onPlay();
        break;
      case this.YT.PlayerState.PAUSED:
        this.props.onPause && this.props.onPause();
        break;
      case this.YT.PlayerState.ENDED:
        this.props.onEnd && this.props.onEnd();
        break;
      case this.YT.PlayerState.BUFFERING:
        this.props.onBuffering && this.props.onBuffering();
        break;
    }
  },
});

module.exports = YoutubePlayer;
