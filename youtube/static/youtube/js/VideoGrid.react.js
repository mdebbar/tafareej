/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  const COLUMN_WIDTH = 240;
  const COLUMN_MARGIN = 8;
  const IMAGE_RATIO = 4/3;

  const PLAYING = 1;
  const PAUSED = 2;
  const STOPPED = 3;

  global.PlayableVideo = React.createClass({
    displayName: 'PlayableVideo',
    propTypes: {
      video: PropTypes.object.isRequired,
      width: PropTypes.number.isRequired,
      onPlay: PropTypes.func,
      onPause: PropTypes.func,
      onStop: PropTypes.func
    },
    getInitialState: function() {
      return {
        isPlaying: false
      };
    },
    _renderMedia: function(video) {
      if (this.state.isPlaying) {
        return (
          <YoutubePlayer
            autoplay={true}
            videoID={video.id}
            onEnd={this._stop}
          />
        );
      } else {
        return {
          // TODO: use better image
          image: <img className="video-grid-image" src={video.images[0]} />,
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
      this.props.onPlay && this.props.onPlay(this.props.video.id);
    },
    _stop: function() {
      this.setState({isPlaying: false});
      this.props.onStop && this.props.onStop(this.props.video.id);
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
    render: function() {
      return this.transferPropsTo(
        <Pinterest
          className="video-grid-container"
          columnWidth={COLUMN_WIDTH}
          columnMargin={COLUMN_MARGIN}>
          {this.props.videos.map(this._renderItem)}
          <Spinner
            className="video-grid-spinner"
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
            className="video-grid-item"
            video={video}
            width={colSpan * (COLUMN_WIDTH + COLUMN_MARGIN) - COLUMN_MARGIN}
            onPlay={this._onItemPlay}
            onStop={this._onItemStop}
          />
        </PinterestItem>
      );
    },
    _onItemPlay: function(videoID) {
      this.state.players[videoID] = PLAYING;
      this.forceUpdate();
    },
    _onItemStop: function(videoID) {
      this.state.players[videoID] = STOPPED;
      this.forceUpdate();
    }
  });

})(this);
