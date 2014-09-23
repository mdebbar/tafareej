/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.ViewPage = React.createClass({
    displayName: 'ViewPage',
    propTypes: {
      autoplay: PropTypes.bool,
      video: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string
      }).isRequired
    },
    getInitialState: function() {
      return {
        isLoading: false,
        snippets: [],
        video: this.props.video
      };
    },
    componentWillMount: function() {
      // TODO: maybe try to get the query from the URL?
      // setup history management
      this.hm = new HistoryManager(
        {video: this.state.video, query: HistoryManager.getState().query},
        this.state.video.title
      );
      this.hm.onSwitch(this._onHistorySwitch);
    },
    componentDidMount: function() {
      // use initial query on page load
      var query = HistoryManager.getState().query || '';
      this.refs.searchable.setQuery(query);
      this._onSearch(query);

      // cache initial video
      this._cacheVideo(this.state.video);
    },
    _enableInfiniteScroll: function() {
      this.refs.scroller.enable();
    },
    _disableInfiniteScroll: function() {
      this.refs.scroller.disable();
    },
    _onHistorySwitch: function(event) {
      this.setState({video: event.state.video});
      this._query = event.state.query;
      this.refs.searchable.setQuery(this._query);
    },
    render: function() {
      return (
        <MultiColumn>
          <Column className="sticky-column" size={7} push={5}>
            <YoutubePlayerContainer
              autoplay={this.props.autoplay}
              video={this.state.video}
              onSwitchVideo={this._videoSelectedFromPlayer}
            />
          </Column>
          <Column size={5}>
            <InfiniteScroll
              ref="scroller"
              buffer={800}
              onTrigger={this._fetchMoreSnippets}>
              <SearchableSnippetList
                ref="searchable"
                isLoading={this.state.isLoading}
                videoList={this.state.isLoading ? [] : this.state.snippets}
                selectedVideoID={this.state.video.id}
                onSearch={this._onSearch}
                onSnippetClick={this._setVideo}
              />
            </InfiniteScroll>
          </Column>
        </MultiColumn>
      );
    },
    _buildURL: function(videoID, query) {
      // TODO: create a URL class to handle URL building and parsing etc...
      var url = URL.video(videoID);
      if (query) {
        url += '?q=' + encodeURIComponent(query);
      }
      return url;
    },
    _search: function(query) {
      this._disableInfiniteScroll();
      this.setState({isLoading: true});
      this.api && this.api.abandon();
      this.api = API.search(query, this._setSnippets);
    },
    _related: function(videoID) {
      this._disableInfiniteScroll();
      this.setState({isLoading: true});
      this.api && this.api.abandon();
      this.api = API.related(videoID, this._setSnippets);
    },
    // Called when the user clicks on a suggestion from inside the player.
    _videoSelectedFromPlayer: function(videoID) {
      // Clear search query
      this.refs.searchable.setQuery('');
      this._query = '';

      var cachedVideo = VideoCacheStore.get(videoID);
      if (cachedVideo) {
        this._setVideo(cachedVideo);
        // show related videos
        this._related(videoID);
      } else {
        this.hm.push(
          {video: {id: videoID}, query: this._query},
          'Loading...',
          this._buildURL(videoID, this._query)
        );
        API.one(videoID, function(video) {
          this._setVideo(video, true);
          // show related videos
          this._related(videoID);
        }.bind(this));
      }
    },
    _setVideo: function(video, replaceState) {
      this.setState({video: video});
      var historyState = {video: video, query: this._query};
      var historyURL = this._buildURL(video.id, this._query);
      if (replaceState) {
        this.hm.replace(historyState, video.title, historyURL);
      } else {
        this.hm.push(historyState, video.title, historyURL);
      }
    },
    _onSearch: function(query) {
      if (query === this._query) {
        return;
      }
      this._query = query;

      this.hm.replace(
        {video: this.state.video, query: query},
        this.state.video.title,
        this._buildURL(this.state.video.id, query)
      );
      if (query) {
        this._search(query);
      } else {
        this._related(this.state.video.id);
      }
    },
    _fetchMoreSnippets: function() {
      if (this.api && typeof this.api.next === 'function') {
        this.api = this.api.next(this._appendSnippets);
      }
    },
    _setSnippets: function(videos) {
      videos.forEach(this._cacheVideo);
      this.setState({
        isLoading: false,
        snippets: videos
      }, this._enableInfiniteScroll);
    },
    _appendSnippets: function(videos) {
      if (!Array.isArray(videos) || videos.length === 0) {
        return;
      }
      videos.forEach(this._cacheVideo);
      this.setState(
        {snippets: this.state.snippets.concat(videos)},
        this._enableInfiniteScroll
      );
    },
    _cacheVideo: function(video) {
      VideoCacheStore.set(video.id, video);
    }
  });

})(this);
