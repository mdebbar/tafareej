// CSS
require('../../css/video-grid.css');

var CSS = require('../util/CSS');
var Pinterest = require('./Pinterest.react');
var PlayableVideo = require('./PlayableVideo.react');
var React = require('react');
var Spinner = require('./Spinner.react');

var PinterestItem = Pinterest.Item;

const COLUMN_WIDTH = 240;
const COLUMN_MARGIN = 8;

const PLAYING = 1;
const PAUSED = 2;
const STOPPED = 3;


var VideoGrid = React.createClass({
  propTypes: {
    isLoading: React.PropTypes.bool,
    videos: React.PropTypes.array.isRequired,
  },

  getInitialState: function() {
    // TODO: store states of all running players
    // - mute all except the last one
    // - shrink all except the last one should be expanded
    // - when a new video is played maybe pause previous one?
    return {
      players: {},
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.isLoading) {
      this.setState({players: {}});
    }
  },

  render: function() {
    var {videos, isLoading, ...other} = this.props;
    return (
      <Pinterest
        {...other}
        className={CSS.join(this.props.className, 'video-grid-container')}
        columnWidth={COLUMN_WIDTH}
        columnMargin={COLUMN_MARGIN}>
        {videos.map(this._renderItem)}
        <Spinner
          className="video-grid-spinner"
          shown={isLoading}
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
          data-background="white hover"
          data-border="all"
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
  },
});

module.exports = VideoGrid;
