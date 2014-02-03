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
      isLoading: PropTypes.bool,
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
              videoList={this.props.videoList}
              onSnippetClick={this.props.onSnippetClick}
            />
            <Spinner className="snippet-list-spinner" shown={this.props.isLoading} />
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
