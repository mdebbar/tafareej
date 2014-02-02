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
            <div class="snippet-duration">{this.props.duration}</div>
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
    return text.length > max ? text.slice(max) : text;
  }

  global.SnippetItem = React.createClass({
    propTypes: {
      video: PropTypes.object.isRequired
    },

    render: function() {
      var video = this.props.video;
      return (
        <a className="snippet-link" href={video.url}>
          <SnippetImage source={video.images[0]} duration={video.duration} />
          <div className="snippet-content">
            <h4 className="snippet-title">{processText(video.title, 60)}</h4>
            <p className="snippet-excerpt">{processText(video.excerpt, 100)}</p>
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
      videoID: PropTypes.string
    },
    getInitialState: function() {
      return {
        query: this.props.initialQuery || '',
        videoList: this.props.initialVideoList || []
      }
    },
    componentWillMount: function() {
      Store.listen('search_results', this._onSearchResults);
      this._debouncedSearch = debounce(this._triggerSearch, 500);
    },
    componentWillUnmount: function() {
      this._debouncedSearch.cancel();
      delete this._debouncedSearch;
    },
    render: function() {
      return (
        <div>
          <input
            type="text"
            className="form-control search-box-input"
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
    _onSearchResults: function(results) {
      this.setState({videoList: results});
    }
  });

})(this);
