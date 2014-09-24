/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.HomePage = React.createClass({
    displayName: 'HomePage',
    propTypes: {
      siteName: PropTypes.string.isRequired
    },
    getInitialState: function() {
      return {
        query: new URI().getParam('q') || HistoryManager.getState().query || '',
        isLoading: false,
        videos: [],
        pageTitle: document.title
      };
    },
    componentDidMount: function() {
      // setup history management
      this.hm = new HistoryManager({query: this.state.query}, this._getPageTitle());
      this.hm.onSwitch(this._onHistorySwitch);

      // show popular videos on page load
      this._onSearch(this.state.query);
    },
    _getPageTitle: function() {
      if (this.state.query) {
        return this.props.siteName + ' - ' + this.state.query;
      }
      return this.props.siteName;
    },
    _enableInfiniteScroll: function() {
      this.refs.scroller.enable();
    },
    _disableInfiniteScroll: function() {
      this.refs.scroller.disable();
    },
    _onHistorySwitch: function(event) {
      this.setState({video: event.state});
    },
    render: function() {
      return (
        <div>
          <SearchBox
            query={this.state.query}
            onChange={this._onSearch}
            onSelect={this._onSearch}
          />
          <InfiniteScroll
            ref="scroller"
            buffer={800}
            onTrigger={this._fetchMoreVideos}>
            <pre>{this.state.videos}</pre>
          </InfiniteScroll>
        </div>
      );
    },
    _search: function(query) {
      this._disableInfiniteScroll();
      this.setState({isLoading: true});
      this.api && this.api.abandon();
      this.api = API.search(query, this._setVideos);
    },
    _popular: function() {
      this._disableInfiniteScroll();
      this.setState({isLoading: true});
      this.api && this.api.abandon();
      this.api = API.popular(this._setVideos);
    },
    _buildURL: function(query) {
      return new URI().setParam('q', query);
    },
    _onSearch: function(query) {
      if (query === this.state.query) {
        return;
      }
      this.setState({query: query});

      this.hm.replace(
        {query: query},
        this.state.pageTitle,
        this._buildURL(query)
      );
      if (query) {
        this._search(query);
      } else {
        this._popular();
      }
    },
    _fetchMoreVideos: function() {
      if (this.api && typeof this.api.next === 'function') {
        this.api = this.api.next(this._appendVideos);
      }
    },
    _setVideos: function(videos) {
      this.setState({
        isLoading: false,
        videos: videos
      }, this._enableInfiniteScroll);
    },
    _appendVideos: function(videos) {
      if (!Array.isArray(videos) || videos.length === 0) {
        return;
      }
      this.setState(
        {videos: this.state.videos.concat(videos)},
        this._enableInfiniteScroll
      );
    }
  });

})(this);
