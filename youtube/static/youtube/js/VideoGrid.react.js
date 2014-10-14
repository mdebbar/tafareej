/** @jsx React.DOM */

(function(global) {
  var CSS = require('CSS');
  var Pinterest = require('Pinterest');
  var PinterestItem = require('PinterestItem');
  var React = require('React');
  var SmartLink = require('SmartLink');
  var Spinner = require('Spinner');
  var YoutubePlayer = require('YoutubePlayer');

  var PropTypes = React.PropTypes;

  const COLUMN_WIDTH = 240;
  const COLUMN_MARGIN = 8;
  const IMAGE_RATIO = 4/3;

  const PLAYING = 1;
  const PAUSED = 2;
  const STOPPED = 3;

  var PlayableVideo = global.PlayableVideo = React.createClass({
    displayName: 'PlayableVideo',
    propTypes: {
      video: PropTypes.object.isRequired,
      width: PropTypes.number.isRequired,
      onBeforePlay: PropTypes.func,
      onPlay: PropTypes.func,
      onPause: PropTypes.func,
      onStop: PropTypes.func
    },
    getInitialState: function() {
      return {
        isPlaying: false
      };
    },
    mute: function() {
      var player = this._getPlayer();
      player && player.mute();
    },
    unMute: function() {
      var player = this._getPlayer();
      player && player.unMute();
    },
    _getPlayer: function() {
      return this.refs && this.refs.player;
    },
    _renderMedia: function(video) {
      if (this.state.isPlaying) {
        return (
          <YoutubePlayer
            ref="player"
            autoplay={true}
            videoID={video.id}
            onPlay={this._onPlay}
            onEnd={this._stop}
          />
        );
      } else {
        var src = video.thumbnails.high || video.thumbnails.medium || video.thumbnails.default;
        return {
          image: <img className="video-grid-image" src={src} />,
          duration: <div className="video-grid-duration">{video.duration}</div>
        };
      }
    },
    render: function() {
      var video = this.props.video;
      var mediaWidth = this.props.width - 8; /* 8px of side padding */
      var mediaStyle = {
        width: mediaWidth + 'px',
        height: Math.floor(mediaWidth / IMAGE_RATIO) + 'px'
      };
      var rootStyle = {width: this.props.width + 'px'};
      return this.transferPropsTo(
        <div dir="auto" style={rootStyle}>
          <SmartLink
            className="video-grid-link video-grid-media-container"
            style={mediaStyle}
            href={video.url}
            onClick={this._play}>
            {this._renderMedia(video)}
          </SmartLink>
          <h4 className="video-grid-title">
            {video.title}
          </h4>
        </div>
      );
    },
    _play: function() {
      this.setState({isPlaying: true});
      this.props.onBeforePlay && this.props.onBeforePlay(this.props.video.id);
    },
    _stop: function() {
      this.setState({isPlaying: false});
      this.props.onStop && this.props.onStop(this.props.video.id);
    },
    _onPlay: function() {
      this.props.onPlay && this.props.onPlay(this.props.video.id);
    }
  });

  global.VideoGrid = React.createClass({
    displayName: 'VideoGrid',
    propTypes: {
      isLoading: PropTypes.bool,
      videos: PropTypes.array.isRequired
    },
    getInitialState: function() {
      // TODO: store states of all running players
      // - mute all except the last one
      // - shrink all except the last one should be expanded
      // - when a new video is played maybe pause previous one?
      return {
        players: {}
      };
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.isLoading) {
        this.setState({players: {}});
      }
    },
    render: function() {
      return this.transferPropsTo(
        <Pinterest
          className="video-grid-container"
          columnWidth={COLUMN_WIDTH}
          columnMargin={COLUMN_MARGIN}>
          {this.props.videos.map(this._renderItem)}
          <Spinner
            className={CSS.join('video-grid-spinner', 'bkgnd')}
            shown={this.props.isLoading}
          />
        </Pinterest>
      );
    },
    _renderItem: function(video) {
      var colSpan = 1;
      if (this.state.players[video.id] === PLAYING) {
        colSpan = 2;
      }
      return (
        <PinterestItem columnSpan={colSpan}>
          <PlayableVideo
            ref={'item_' + video.id}
            className="video-grid-item"
            video={video}
            width={colSpan * (COLUMN_WIDTH + COLUMN_MARGIN) - COLUMN_MARGIN}
            onBeforePlay={this._onBeforeItemPlay}
            onPlay={this._onItemPlay}
            onStop={this._onItemStop}
          />
        </PinterestItem>
      );
    },
    _onBeforeItemPlay: function(videoID) {
      Object.keys(this.state.players).forEach(this._muteIfPlaying);
      this.state.players[videoID] = PLAYING;
      this.forceUpdate();
    },
    _onItemPlay: function(videoID) {
      this.refs['item_' + videoID].unMute();
    },
    _onItemStop: function(videoID) {
      this.state.players[videoID] = STOPPED;
      this.forceUpdate();
    },
    _muteIfPlaying: function(videoID) {
      if (this.state.players[videoID] === PLAYING) {
        var ref = this.refs['item_' + videoID];
        ref && ref.mute();
      }
    }
  });

})(MODULES);
