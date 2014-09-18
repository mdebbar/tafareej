/** @jsx React.DOM */

(function(global) {
  const PLAYER_ID = 'ytplayer';

  var seqID = 0;
  var PropTypes = React.PropTypes;

  var loaded = false;
  (function loadYoutubePlayer() {
    if (loaded) {
      return;
    }
    loaded = true;
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api?playerapiid=ytplayer";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  })();

  // This must be global because the Youtube API needs to call it.
  global.onYouTubeIframeAPIReady = YoutubeStore.set.bind(YoutubeStore, 'api.ready', true);

  global.YoutubePlayer = React.createClass({
    displayName: 'YoutubePlayer',
    propTypes: {
      autoplay: PropTypes.bool,
      theme: PropTypes.oneOf(['dark', 'light']),
      width: PropTypes.number,
      height: PropTypes.number,
      videoID: PropTypes.string.isRequired,
      onSwitchVideo: PropTypes.func
    },
    getDefaultProps: function() {
      return {
        autoplay: true,
        theme: 'dark',
        width: 640,
        height: 390,
        onSwitchVideo: emptyFunction
      };
    },
    componentWillMount: function() {
      this.playerID = PLAYER_ID + String(seqID++);
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
    },
    componentWillReceiveProps: function(nextProps) {
      if (this.player.getVideoData().video_id !== nextProps.videoID) {
        // If it's a different video => stop current video + load the new one!
        // (loading will automatically play the video)
        this.player.stopVideo();
        this.player.loadVideoById(nextProps.videoID);
      } else if (this.player.getPlayerState() !== YT.PlayerState.PLAYING) {
        // If it's not playing => play it!
        this.player.playVideo();
      }
    },
    render: function() {
      var style = {width: this.props.width, height: this.props.height};
      return (
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
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          var videoID = event.target.getVideoData().video_id;
          if (videoID !== this.props.videoID) {
            this.props.onSwitchVideo(videoID);
          }
          break;
      }
    }
  });


  global.YoutubePlayerContainer = React.createClass({
    displayName: 'YoutubePlayerContainer',
    propTypes: {
      autoplay: PropTypes.bool,
      video: PropTypes.object.isRequired,
      onSwitchVideo: PropTypes.func
    },
    getDefaultProps: function() {
      return {
        autoplay: false
      };
    },
    getInitialState: function() {
      return {
        autoreplay: false
      };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      return nextProps.video !== this.props.video || nextState !== this.state;
    },
    render: function() {
      var video = this.props.video;
      var player = this.transferPropsTo(
        <YoutubePlayer
          autoreplay={this.state.autoreplay}
          videoID={video.id}
          onSwitchVideo={this.props.onSwitchVideo}
        />
      );

      return (
        <div className="youtube-player-section">
          <div className="youtube-player-container">
            {player}
          </div>
          <label className="youtube-autoreplay">
            <input
              type="checkbox"
              checked={this.state.autoreplay}
              onChange={this._onAutoreplayChange}
            />
            {' '}
            Auto Replay
          </label>
          <h1 className="youtube-title" dir="auto">{video.title}</h1>
        </div>
      );
    },
    _onAutoreplayChange: function(event) {
      this.setState({autoreplay: event.target.checked});
    }
  });
})(this);
