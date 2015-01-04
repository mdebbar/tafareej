// CSS
require('../../css/snippet.css');

var CSS = require('../util/CSS');
var ImageSwitcher = require('./ImageSwitcher.react');
var Immutable = require('immutable');
var React = require('react');
var SmartLink= require('./SmartLink.react');


var SnippetItem = React.createClass({
  propTypes: {
    video: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onClick: React.PropTypes.func,
  },

  getInitialState() {
    return {
      hovering: false,
    };
  },

  onHover() {
    this.setState({hovering: true});
  },

  onLeave() {
    this.setState({hovering: false});
  },

  render() {
    var video = this.props.video;
    return (
      <SmartLink
        className="snippet-link"
        href={video.get('uri')}
        title={video.get('title')}
        onClick={this.props.onClick}
        onMouseEnter={this.onHover}
        onMouseLeave={this.onLeave}>
        <div className="snippet-image-container">
          <ImageSwitcher
            className="snippet-image"
            images={video.get('frames')}
            enabled={this.state.hovering}
          />
          <div className="snippet-duration" data-border-round="all">{video.get('duration')}</div>
        </div>
        <div className="snippet-content">
          <h4 className="snippet-title">{video.get('title')}</h4>
          <p className="snippet-excerpt" title={video.get('desc')}>
            {video.get('desc')}
          </p>
        </div>
      </SmartLink>
    );
  }
});

var SnippetNub = React.createClass({
  render() {
    return <div className="snippet-nub" />;
  },
});

var SnippetList = React.createClass({
  propTypes: {
    videoList: React.PropTypes.instanceOf(Immutable.Seq).isRequired,
    selectedVideoID: React.PropTypes.string,
    onSnippetClick: React.PropTypes.func,
  },

  render() {
    var {videoList, className, ...other} = this.props;
    return (
      <ul
        {...other}
        className={CSS.join(className, 'snippet-list')}>
        {videoList.map(this._renderSnippetItem).toArray()}
      </ul>
    )
  },

  _renderSnippetItem(video) {
    var isActiveVideo = this.props.selectedVideoID === video.get('id');
    return (
      <li
        className={CSS.join({
          'snippet-item': true,
          'snippet-item-selected': isActiveVideo,
        })}
        data-background={isActiveVideo ? '' : CSS.join('white', 'hover')}
        data-border="bottom"
        key={video.get('id')}
        dir="auto">
        {isActiveVideo && <SnippetNub />}
        <SnippetItem
          video={video}
          onClick={this.props.onSnippetClick.bind(null, video.get('id'))}
        />
      </li>
    );
  },
});

module.exports = SnippetList;
