/** @jsx React.DOM */

(function(global) {
  var CSS = require('CSS');
  var React = require('React');
  var SearchBox = require('SearchBox');
  var Spinner = require('Spinner');

  var PropTypes = React.PropTypes;

  const IMAGE_SWITCHING_INTERVAL = 1000;

  var SnippetImage = global.SnippetImage = React.createClass({
    displayName: 'SnippetImage',
    propTypes: {
      source: PropTypes.string,
      duration: PropTypes.string,
      forceRender: PropTypes.bool
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

  var SnippetItem = global.SnippetItem = React.createClass({
    displayName: 'SnippetItem',
    propTypes: {
      maxTitleLen: PropTypes.number,
      maxExcerptLen: PropTypes.number,
      video: PropTypes.object.isRequired
    },
    getDefaultProps: function() {
      return {
        maxTitleLen: 60,
        maxExcerptLen: 100
      };
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
          <div>
            <h4 className="snippet-title">
              {truncate(video.title, this.props.maxTitleLen)}
            </h4>
            <p className="snippet-excerpt" title={video.excerpt}>
              {truncate(video.excerpt, this.props.maxExcerptLen)}
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

  var SnippetList = global.SnippetList = React.createClass({
    displayName: 'SnippetList',
    propTypes: {
      videoList: PropTypes.array.isRequired,
      selectedVideoID: PropTypes.string,
      onSnippetClick: PropTypes.func
    },
    render: function() {
      return this.transferPropsTo(
        <ul className="snippet-list">
          {this.props.videoList.map(this._renderSnippetItem)}
        </ul>
      )
    },
    _renderSnippetItem: function(video, ii) {
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

  global.SearchableSnippetList = React.createClass({
    displayName: 'SearchableSnippetList',
    propTypes: {
      isLoading: PropTypes.bool,
      selectedVideoID: PropTypes.string,
      videoList: PropTypes.array.isRequired,
      onSearch: PropTypes.func.isRequired,
      onSnippetClick: PropTypes.func
    },
    getDefaultProps: function() {
      return {
        isLoading: false
      };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      return nextProps.isLoading !== this.props.isLoading ||
        nextProps.videoList !== this.props.videoList ||
        nextProps.selectedVideoID !== this.props.selectedVideoID;
    },
    setQuery: function(query) {
      this.refs.searchbox.setQuery(query);
    },
    render: function() {
      return (
        <div className="snippet-list-section">
          <SearchBox
            ref="searchbox"
            className={CSS.join('sticky-search-box-section', colClass(5))}
            data-background="transparent"
            onSearch={this.props.onSearch}
          />
          <div className="snippet-list-container">
            <SnippetList
              data-border={this.props.isLoading ? null : "all"}
              videoList={this.props.videoList}
              selectedVideoID={this.props.selectedVideoID}
              onSnippetClick={this.props.onSnippetClick}
            />
            <Spinner
              className={CSS.join('snippet-list-spinner', colClass(5))}
              shown={this.props.isLoading}
            />
          </div>
        </div>
      );
    }
  });

})(MODULES);
