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
        isLoading: false,
        videos: []
      };
    },
    componentDidMount: function() {
      // setup history management
      this.hm = new HistoryManager();
      this.hm.onSwitch(this._onHistorySwitch);

      // Get query from URL or history state or load popular videos
      var query = new URI().getParam('q') || HistoryManager.getState().query || '';
      this.refs.search.setQuery(query);
      this._onSearch(query);
    },
    _getPageTitle: function(query) {
      if (query) {
        return this.props.siteName + ' - ' + query;
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
      var query = event.state.query;
      this.refs.search.setQuery(query);
      this._onSearch(query);
    },
    render: function() {
      return (
        <div>
          <SearchBox
            ref="search"
            className="sticky-centered-search-box bkgnd"
            onSearch={this._onSearch}
          />
          <InfiniteScroll
            ref="scroller"
            buffer={800}
            onTrigger={this._fetchMoreVideos}>
            <VideoGrid
              isLoading={this.state.isLoading}
              videos={this.state.isLoading ? [] : this.state.videos}
            />
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
      var url = new URI();
      return query ? url.setParam('q', query) : url.removeParam('q');
    },
    _onSearch: function(query) {
      this.hm.replace(
        {query: query},
        this._getPageTitle(query),
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
