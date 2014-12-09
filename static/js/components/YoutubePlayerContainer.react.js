var React = require('React');
var YoutubePlayer = require('./YoutubePlayer.react');

var YoutubePlayerContainer = React.createClass({
  propTypes: {
    autoplay: React.PropTypes.bool,
    video: React.PropTypes.object.isRequired,
    onSwitchVideo: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      autoplay: false,
    };
  },

  getInitialState() {
    return {
      repeat: false,
    };
  },

 shouldComponentUpdate({video}, nextState) {
    return video !== this.props.video || nextState !== this.state;
  },

 render() {
    var {video, ...others} = this.props;
    var player =
      <YoutubePlayer
        {...others}
        ref="player"
        videoID={video.id}
        onEnd={this._onEnd}
      />;

    return (
      <div className="youtube-player-section">
        <div className="youtube-player-container">
          {player}
        </div>
        <label
          className="youtube-repeat"
          data-background="light"
          data-border-round="bottom"
          data-border="horz bottom">
          <input
            type="checkbox"
            checked={this.state.repeat}
            onChange={this._onRepeatChange}
          />
          {' '}
          Repeat
        </label>
        <h2 className="youtube-title" dir="auto">{video.title}</h2>
      </div>
      );
  },

 _onRepeatChange(event) {
    this.setState({repeat: event.target.checked});
  },

 _onEnd() {
    if (this.state.repeat) {
      this.refs.player.play();
    }
  }
});

module.exports = YoutubePlayerContainer;
