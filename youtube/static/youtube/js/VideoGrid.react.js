/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.PlayableVideo = React.createClass({
    displayName: 'PlayableVideo',
    propTypes: {
      video: PropTypes.object.isRequired
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
      return this.transferPropsTo(
        <div dir="auto">
          <SmartLink
            className="video-grid-link video-grid-image-container"
            href={video.url}
            onClick={this._play}>
            <div className="video-grid-image-container">
              {this._renderMedia(video)}
            </div>
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
      return (
        <div className="video-grid-container">
          {this.props.videos.map(function(video) {
            return <PlayableVideo className="video-grid-item" video={video} />
          })}
        </div>
      );
    }
  });

})(this);
