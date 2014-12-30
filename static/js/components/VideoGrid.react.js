// CSS
require('../../css/video-grid.css');

var AlternateGrid = require('./AlternateGrid.react');
var CSS = require('../util/CSS');
var DOM = require('../util/DOM');
var Immutable = require('immutable');
var React = require('react');
var Spinner = require('./Spinner.react');
var URI = require('../util/URI');

var getBestImage = require('../util/getBestImage');

var GridItem = AlternateGrid.Item;

const COLUMN_WIDTH = 240;
const COLUMN_HEIGHT = 135;


var VideoGrid = React.createClass({
  propTypes: {
    query: React.PropTypes.string,
    isLoading: React.PropTypes.bool,
    videos: React.PropTypes.instanceOf(Immutable.Seq).isRequired,
  },

  getInitialState() {
    return {
      active: {},
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      this.setState({active: {}});
    }
  },

  render() {
    var {videos, isLoading, className, ...other} = this.props;
    if (isLoading) {
      return (
        <Spinner
          className="video-grid-spinner"
          shown={isLoading}
        />
      );
    }

    var items = [];
    videos.forEach((video) => {
      items.push(this._renderItem(video));
    });
    return (
      <AlternateGrid
        {...other}
        className={CSS.join(className, 'video-grid-container')}
        itemWidth={COLUMN_WIDTH}
        itemHeight={COLUMN_HEIGHT}>
        {items}
      </AlternateGrid>
    );
  },

  _renderItem(video) {
    var id = video.get('id');
    var link = new URI(video.get('uri')).setParams({
      q: this.props.query,
      pop: this.props.query ? 0 : 1,
    }).toString();
    var isActive = !!this.state.active[id];
    return (
      <GridItem
        active={isActive}
        data-video-id={id}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}>
        <div className="video-grid-item">
          <a className="video-grid-link" href={link}>
            <img
              className="video-grid-image"
              src={getBestImage(video.get('pictures'), 240).url}
            />
            <div className="video-grid-duration">{video.get('duration')}</div>
          </a>
        </div>
      </GridItem>
    );
  },

  _onMouseEnter(event) {
    var videoID = DOM.attrFromAsc(event.target, 'data-video-id');
    this.state.active[videoID] = true;
    this.forceUpdate();
  },

  _onMouseLeave(event) {
    var videoID = DOM.attrFromAsc(event.target, 'data-video-id');
    delete this.state.active[videoID];
    this.forceUpdate();
  },
});

module.exports = VideoGrid;
