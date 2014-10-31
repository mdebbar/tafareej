// CSS
require('../../css/snippet.css');

var CSS = require('../util/CSS');
var React = require('React');

const IMAGE_SWITCHING_INTERVAL = 1000;

var SnippetImage = React.createClass({
  displayName: 'SnippetImage',
  propTypes: {
    source: React.PropTypes.string,
    duration: React.PropTypes.string,
    forceRender: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      forceRender: true
    };
  },

  render: function() {
    if (this.props.source) {
      return (
        <div className="snippet-image-container">
          <img className="snippet-image" src={this.props.source} />
          <div className="snippet-duration" data-border="round">{this.props.duration}</div>
        </div>
      );
    } else if (this.props.forceRender) {
      return <div className="snippet-image-container"></div>;
    } else {
      return <noscript />;
    }
  }
});

var SnippetItem = React.createClass({
  displayName: 'SnippetItem',
  propTypes: {
    video: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      imageIndex: 0
    };
  },
  componentWillUnmount: function() {
    this._stopSwitching(false);
  },
  _startSwitching: function() {
    this.imageSwitcher = setInterval(this._switchImage, IMAGE_SWITCHING_INTERVAL);
    this._switchImage();
  },
  _stopSwitching: function(resetImageIndex) {
    this.imageSwitcher && clearInterval(this.imageSwitcher);
    if (resetImageIndex !== false) {
      this.setState({imageIndex: 0});
    }
  },
  _switchImage: function() {
    var newIndex = this.state.imageIndex + 1;
    if (newIndex === this.props.video.images.length) {
      newIndex = 0;
    }
    this.setState({imageIndex: newIndex});
  },
  render: function() {
    var video = this.props.video;
    return (
      <a
        className="snippet-link"
        href={video.url}
        title={video.title}
        onMouseEnter={this._startSwitching}
        onMouseLeave={this._stopSwitching}>
        <SnippetImage source={video.images[this.state.imageIndex]} duration={video.duration} />
        <div className="snippet-content">
          <h4 className="snippet-title">{video.title}</h4>
          <p className="snippet-excerpt" title={video.excerpt}>
            {video.excerpt}
          </p>
        </div>
      </a>
    );
  }
});

var SnippetNub = React.createClass({
  displayName: 'SnippetNub',
  render: function() {
    return <div className="snippet-nub" />;
  }
});

var SnippetList = React.createClass({
  displayName: 'SnippetList',
  propTypes: {
    videoList: React.PropTypes.array.isRequired,
    selectedVideoID: React.PropTypes.string,
    onSnippetClick: React.PropTypes.func
  },
  render: function() {
    return this.transferPropsTo(
      <ul className="snippet-list">
        {this.props.videoList.map(this._renderSnippetItem)}
      </ul>
    )
  },
  _renderSnippetItem: function(video) {
    var isActiveVideo = this.props.selectedVideoID === video.id;
    return (
      <li
        className={CSS.join({
          'snippet-item': true,
          'snippet-item-selected': isActiveVideo
        })}
        data-background={CSS.join({
          hover: true,
          light: isActiveVideo
        })}
        data-border="bottom"
        key={video.id}
        dir="auto"
        onClick={this._onClick.bind(this, video)}>
        {isActiveVideo && <SnippetNub />}
        <SnippetItem video={video} onClick={this.props.onSnippetClick} />
      </li>
    );
  },
  _onClick: function(video, event) {
    // If it's a special click, let the default behavior happen.
    if (!this.props.onSnippetClick || event.ctrlKey || event.shiftKey || event.metaKey) {
      return;
    }
    this.props.onSnippetClick(video);
    event.preventDefault();
  }
});

module.exports = SnippetList;
