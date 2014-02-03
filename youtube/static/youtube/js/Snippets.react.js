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

  global.SnippetList = React.createClass({
    displayName: 'SnippetList',
    propTypes: {
      videoList: PropTypes.array.isRequired,
      onSnippetClick: PropTypes.func
    },
    render: function() {
      return (
        <ul className="snippet-list">
          {this.props.videoList.map(this._renderSnippetItem)}
        </ul>
      )
    },
    _renderSnippetItem: function(video) {
      return (
        <li className="snippet-item" key={video.id} onClick={this._onClick.bind(this, video)}>
          <SnippetItem video={video} onClick={this.props.onSnippetClick} />
        </li>
      );
    },
    _onClick: function(video, event) {
      if (this.props.onSnippetClick) {
        this.props.onSnippetClick(video);
        event.preventDefault();
      }
    }
  });

  global.SearchableSnippetList = React.createClass({
    displayName: 'SearchableSnippetList',
    propTypes: {
      /**
       * This will be used to fetch related videos when the search box is empty.
       */
      initialQuery: PropTypes.string,
      initialVideoList: PropTypes.array,
      searchOnMount: PropTypes.bool,
      videoID: PropTypes.string,
      onResults: PropTypes.func,
      onSnippetClick: PropTypes.func
    },
    getDefaultProps: function() {
      return {
        searchOnMount: true,
        onResults: emptyFunction
      };
    },
    getInitialState: function() {
      return {
        loading: false,
        query: this.props.initialQuery || '',
        videoList: this.props.initialVideoList || []
      }
    },
    componentDidMount: function() {
      this._debouncedSearch = debounce(this._triggerSearch, 500);
      this._listeners = [
        Store.listen('search_results', this._onSearchResults),
        Store.listen('related_videos', this._onRelatedVideos)
      ];
      this.props.searchOnMount && this._triggerSearch();
    },
    componentWillUnmount: function() {
      this._listeners.forEach(function(l) {
        l.remove();
      });
      this._debouncedSearch.cancel();
      delete this._debouncedSearch;
    },
    render: function() {
      return (
        <div>
          <input
            className="form-control search-box-input"
            dir="auto"
            type="text"
            value={this.state.query}
            onChange={this._onQueryChange}
          />
          <div className="snippet-list-container">
            <SnippetList
              videoList={this.state.videoList}
              onSnippetClick={this.props.onSnippetClick}
            />
            <Spinner className="snippet-list-spinner" shown={this.state.loading} />
          </div>
        </div>
      );
    },
    _onQueryChange: function(event) {
      this.setState({query: event.target.value});
      this._debouncedSearch();
    },
    _triggerSearch: function() {
      this.setState({loading: true});
      if (this.state.query) {
        API.search(this.state.query);
      } else {
        var videoID = Store.get('video').id;
        videoID && API.related(videoID);
      }
    },
    _onSearchResults: function(videos) {
      if (this.state.query) {
        this.setState({
          loading: false,
          videoList: videos
        });
        this.props.onResults(videos);
      }
    },
    _onRelatedVideos: function(videos) {
      if (!this.state.query) {
        this.setState({
          loading: false,
          videoList: videos
        });
        this.props.onResults(videos);
      }
    }
  });

})(this);
