// CSS
require('../../css/snippet.css');

var CSS = require('../util/CSS');
var Immutable = require('immutable');
var React = require('react');
var SmartLink= require('./SmartLink.react');

const IMAGE_SWITCHING_INTERVAL = 1000;

var SnippetImage = React.createClass({
  propTypes: {
    source: React.PropTypes.string,
    duration: React.PropTypes.string,
    forceRender: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      forceRender: true,
    };
  },

  render() {
    if (this.props.source) {
      return (
        <div className="snippet-image-container">
          <img className="snippet-image" src={this.props.source} />
          <div className="snippet-duration" data-border-round="all">{this.props.duration}</div>
        </div>
      );
    } else if (this.props.forceRender) {
      return <div className="snippet-image-container"></div>;
    } else {
      return <noscript />;
    }
  },
});

var SnippetItem = React.createClass({
  propTypes: {
    video: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onClick: React.PropTypes.func,
  },

  getInitialState() {
    return {
      imageIndex: 0,
    };
  },

  componentWillUnmount() {
    this._stopSwitching(false);
  },

  _startSwitching() {
    this.imageSwitcher = setInterval(this._switchImage, IMAGE_SWITCHING_INTERVAL);
    this._switchImage();
  },

  _stopSwitching(resetImageIndex) {
    this.imageSwitcher && clearInterval(this.imageSwitcher);
    if (resetImageIndex !== false) {
      this.setState({imageIndex: 0});
    }
  },

  _switchImage() {
    var newIndex = this.state.imageIndex + 1;
    if (newIndex === this.props.video.get('frames').length) {
      newIndex = 0;
    }
    this.setState({imageIndex: newIndex});
  },

  render() {
    var video = this.props.video;
    return (
      <SmartLink
        className="snippet-link"
        href={video.get('uri')}
        title={video.get('title')}
        onClick={this.props.onClick}
        onMouseEnter={this._startSwitching}
        onMouseLeave={this._stopSwitching}>
        <SnippetImage source={video.get('frames')[this.state.imageIndex]} duration={video.get('duration')} />
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
        data-background={CSS.join({
          white: !isActiveVideo,
          hover: true,
        })}
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
