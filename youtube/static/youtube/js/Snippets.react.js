/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.SnippetImage = React.createClass({
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
            <div className="snippet-duration">{this.props.duration}</div>
          </div>
        );
      } else if (this.props.forceRender) {
        return <div className="snippet-image-container"></div>;
      } else {
        return <noscript />;
      }
    }
  });

  global.SnippetItem = React.createClass({
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
    render: function() {
      var video = this.props.video;
      return (
        <a className="snippet-link" href={video.url} title={video.title}>
          <SnippetImage source={video.images[0]} duration={video.duration} />
          <div className="snippet-content">
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

  global.SnippetList = React.createClass({
    displayName: 'SnippetList',
    propTypes: {
      videoList: PropTypes.array.isRequired,
      selectedVideoID: PropTypes.string,
      onSnippetClick: PropTypes.func
    },
    render: function() {
      return (
        <ul className="snippet-list">
          {this.props.videoList.map(this._renderSnippetItem)}
        </ul>
      )
    },
    _renderSnippetItem: function(video, ii) {
      var isActiveVideo = this.props.selectedVideoID === video.id;
      var classes = ['snippet-item'];
      if (isActiveVideo) {
        classes.push('snippet-item-selected');
      }
      return (
        <li
          className={classes.join(' ')}
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
      /**
       * This will be used to fetch related videos when the search box is empty.
       */
      initialQuery: PropTypes.string,
      isLoading: PropTypes.bool,
      selectedVideoID: PropTypes.string,
      videoList: PropTypes.array.isRequired,
      onSearch: PropTypes.func.isRequired,
      onSnippetClick: PropTypes.func
    },
    getDefaultProps: function() {
      return {
        initialQuery: '',
        isLoading: false
      };
    },
    getInitialState: function() {
      return {
        query: this.props.initialQuery
      }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      return nextProps.isLoading !== this.props.isLoading ||
        nextProps.videoList !== this.props.videoList ||
        nextProps.selectedVideoID !== this.props.selectedVideoID ||
        nextState.query !== this.state.query;
    },
    componentDidMount: function() {
      this._debouncedSearch = debounce(this.props.onSearch, 500);
    },
    componentWillUnmount: function() {
      this._debouncedSearch.cancel();
      delete this._debouncedSearch;
    },
    render: function() {
      return (
        <div className="snippet-list-section">
          <SearchBox query={this.state.query} onChange={this._onQueryChange} />
          <div className="snippet-list-container">
            <SnippetList
              videoList={this.props.videoList}
              selectedVideoID={this.props.selectedVideoID}
              onSnippetClick={this.props.onSnippetClick}
            />
            <Spinner
              className={"snippet-list-spinner " + colClass(5)}
              shown={this.props.isLoading}
            />
          </div>
        </div>
      );
    },
    _onQueryChange: function(event) {
      var query = event.target.value;
      this._debouncedSearch(query);
      this.setState({query: query});
    }
  });

})(this);
