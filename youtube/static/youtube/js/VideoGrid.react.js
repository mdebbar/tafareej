/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  const COLUMN_WIDTH = 240;
  const IMAGE_RATIO = 4/3;

  global.PlayableVideo = React.createClass({
    displayName: 'PlayableVideo',
    propTypes: {
      video: PropTypes.object.isRequired,
      width: PropTypes.number.isRequired
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
            onPlay={this._expandPlayer}
            onPause={this._shrinkPlayer}
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
    },
    _stop: function() {
      this.setState({isPlaying: false});
    },
    _shrinkPlayer: function() {
      // TODO
    },
    _expandPlayer: function() {
      // TODO
    }
  });

  global.VideoGrid = React.createClass({
    displayName: 'VideoGrid',
    // TODO: add `isLoading` prop and show a spinner when it's true
    propTypes: {
      videos: PropTypes.array.isRequired
    },
    getInitialState: function() {
      // TODO: store states of all running players
      // - mute all except the last one
      // - shrink all except the last one should be expanded
      // - when a new video is played maybe pause previous one?
      return {

      };
    },
    render: function() {
      return this.transferPropsTo(
        <Pinterest
          className="video-grid-container"
          columnWidth={COLUMN_WIDTH}
          columnMargin={8}>
          {this.props.videos.map(this._renderItem)}
        </Pinterest>
      );
    },
    _renderItem: function(video) {
      return (
        <PlayableVideo
          className="video-grid-item"
          video={video}
          width={COLUMN_WIDTH}
        />
      );
    }
  });

})(this);
