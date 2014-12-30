var Immutable = require('immutable');
var React = require('react');
var SmartLink = require('./SmartLink.react');
var YoutubePlayer = require('./YoutubePlayer.react');

const IMAGE_RATIO = 4/3;

// TODO: decouple this from VideoGrid.react
var PlayableVideo = React.createClass({
  propTypes: {
    video: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    width: React.PropTypes.number.isRequired,
    onBeforePlay: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onStop: React.PropTypes.func,
  },

  getInitialState() {
    return {
      // TODO: change this to "playingStatus".
      isPlaying: false,
    };
  },

  mute() {
    var player = this._getPlayer();
    player && player.mute();
  },

  unMute() {
    var player = this._getPlayer();
    player && player.unMute();
  },

  _getPlayer() {
    return this.refs && this.refs.player;
  },

  _renderMedia(video) {
    if (this.state.isPlaying) {
      return (
        <YoutubePlayer
          ref="player"
          autoplay={true}
          videoID={video.get('id')}
          onPlay={this._onPlay}
          onEnd={this._stop}
        />
      );
    } else {
      var pictures = video.get('pictures');
      var src = pictures[pictures.length - 1].url;
      return {
        image: <img className="video-grid-image" src={src} />,
        duration: <div className="video-grid-duration" data-border-round="all">{video.get('duration')}</div>
      };
    }
  },

  render() {
    var {video, width, ...other} = this.props;

    var mediaWidth = width - 10; /* 8px of side padding + 2px borders */
    var mediaStyle = {
      width: mediaWidth,
      height: Math.floor(mediaWidth / IMAGE_RATIO),
    };

    return (
      <div {...other} dir="auto" style={{width}}>
        <SmartLink
          className="video-grid-link video-grid-media-container"
          style={mediaStyle}
          href={video.get('uri')}
          onClick={this._play}>
          {this._renderMedia(video)}
        </SmartLink>
        <a href={video.get('uri')} className="video-grid-link">
          <h4 className="video-grid-title">
            {video.get('title')}
          </h4>
        </a>
      </div>
    );
  },

  _play() {
    this.setState({isPlaying: true});
    this.props.onBeforePlay && this.props.onBeforePlay(this.props.video.get('id'));
  },

  _stop() {
    this.setState({isPlaying: false});
    this.props.onStop && this.props.onStop(this.props.video.get('id'));
  },

  _onPlay() {
    this.props.onPlay && this.props.onPlay(this.props.video.get('id'));
  },
});

module.exports = PlayableVideo;
