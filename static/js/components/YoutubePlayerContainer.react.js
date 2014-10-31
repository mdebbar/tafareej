var React = require('React');
var YoutubePlayer = require('./YoutubePlayer.react');

var PropTypes = React.PropTypes;

var YoutubePlayerContainer = React.createClass({
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
        ref="player"
        videoID={video.id}
        onSwitchVideo={this.props.onSwitchVideo}
        onEnd={this._onEnd}
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
          Repeat
        </label>
        <h2 className="youtube-title" dir="auto">{video.title}</h2>
      </div>
      );
  },
  _onAutoreplayChange: function(event) {
    this.setState({autoreplay: event.target.checked});
  },
  _onEnd: function() {
    if (this.state.autoreplay) {
      this.refs.player.play();
    }
  }
});

module.exports = YoutubePlayerContainer;
