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
  global.onYouTubeIframeAPIReady = Store.set.bind(Store, 'youtube.api.ready', true);

  global.YoutubePlayer = React.createClass({
    displayName: 'YoutubePlayer',
    propTypes: {
      autoplay: PropTypes.bool,
      theme: PropTypes.oneOf(['dark', 'light']),
      width: PropTypes.number,
      height: PropTypes.number,
      videoID: PropTypes.string.isRequired
    },
    getDefaultProps: function() {
      return {
        autoplay: true,
        theme: 'light',
        width: 640,
        height: 390
      };
    },
    componentWillMount: function() {
      this.playerID = PLAYER_ID + String(seqID++);
    },
    componentDidMount: function() {
      if (Store.get('youtube.api.ready')) {
        this._onYoutubeAPIReady();
      } else {
        this._listener = Store.listen('youtube.api.ready', this._onYoutubeAPIReady);
      }
    },
    componentWillUnmount: function() {
      this._listener && this._listener.remove();
    },
    componentWillReceiveProps: function(nextProps) {
      if (this.props.videoID !== nextProps.videoID) {
        this.player.loadVideoById(nextProps.videoID);
      }
    },
    render: function() {
      var style = {width: this.props.width, height: this.props.height};
      return (
        <Spinner id={this.playerID} className="youtube-player" />
      );
    },
    _onYoutubeAPIReady: function() {
      this.player = new YT.Player(this.playerID, {
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
    }
  });


  global.YoutubePlayerContainer = React.createClass({
    displayName: 'YoutubePlayer',
    propTypes: {
      autoplay: PropTypes.bool,
      videoStore: PropTypes.object
    },
    getDefaultProps: function() {
      return {
        autoplay: false,
        videoStore: Store
      };
    },
    getInitialState: function() {
      return {
        autoreplay: this.props.autoreplay,
        video: this.props.videoStore.get('video')
      };
    },
    componentDidMount: function() {
      this._listeners = [
        this.props.videoStore.listen('video', this._onVideoChange)
      ];
    },
    componentWillUnmount: function() {
      this._listeners.forEach(function(l) {
        l.remove();
      });
    },
    render: function() {
      var player = this.transferPropsTo(
        <YoutubePlayer
          autoreplay={this.state.autoreplay}
          videoID={this.state.video.id}
        />
      );

      return (
        <div>
          <div className="youtube-player-container">
            {player}
          </div>
          <label className="youtube-autoreplay">
            <input
              type="checkbox"
              checked={this.state.autoreplay}
              onChange={this._onAutoreplayChange}
            />
            AutoReplay
          </label>
        </div>
      );
    },
    _onVideoChange: function(video) {
      this.setState({video: video});
    },
    _onAutoreplayChange: function(enabled) {
      Event.fire('youtube.autoreplay', enabled);
    }
  });
})(this);
