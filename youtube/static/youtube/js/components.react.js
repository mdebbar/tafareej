/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.YoutubePlayer = React.createClass({
    propType: {

    },

    render: function() {
      return <div>Youtube Player</div>;
    }
  });

  global.SnippetImage = React.createClass({
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

  function processText(text, max) {
    if (!text) {
      return text;
    }
    return text.length > max ? text.slice(0, max) : text;
  }

  global.SnippetItem = React.createClass({
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
              {processText(video.title, this.props.maxTitleLen)}
            </h4>
            <p className="snippet-excerpt" title={video.excerpt}>
              {processText(video.excerpt, this.props.maxExcerptLen)}
            </p>
          </div>
        </a>
      );
    }
  });

  global.SnippetList = React.createClass({
    propTypes: {
      videoList: PropTypes.array.isRequired
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
        <li className="snippet-item" key={video.id}>
          <SnippetItem video={video} />
        </li>
      );
    }
  });

  global.SearchableSnippetList = React.createClass({
    propTypes: {
      /**
       * This will be used to fetch related videos when the search box is empty.
       */
      initialQuery: PropTypes.string,
      initialVideoList: PropTypes.array,
      searchOnMount: PropTypes.bool,
      videoID: PropTypes.string
    },
    getDefaultProps: function() {
      return {
        searchOnMount: true
      };
    },
    getInitialState: function() {
      return {
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
      this._listener.remove();
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
          <SnippetList videoList={this.state.videoList} />
        </div>
      );
    },
    _onQueryChange: function(event) {
      this.setState({query: event.target.value});
      this._debouncedSearch();
    },
    _triggerSearch: function() {
      if (this.state.query) {
        API.search(this.state.query);
      } else {
        var videoID = Store.get('video').id;
        videoID && API.related(videoID);
      }
    },
    _onSearchResults: function(videos) {
      if (this.state.query) {
        this.setState({videoList: videos});
      }
    },
    _onRelatedVideos: function(videos) {
      if (!this.state.query) {
        this.setState({videoList: videos});
      }
    }
  });

})(this);