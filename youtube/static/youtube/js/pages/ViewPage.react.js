/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  const SCROLL_THROTTLE_DELAY = 100;
  const INFINITE_SCROLL_BUFFER = 400;

  function getDocHeight() {
    var body = document.body;
    var docElem = document.documentElement;

    return Math.max(
      body.scrollHeight, body.offsetHeight,
      docElem.clientHeight, docElem.scrollHeight, docElem.offsetHeight
    );
  }

  global.ViewPage = React.createClass({
    displayName: 'ViewPage',
    getInitialState: function() {
      return {
        isLoading: false,
        snippets: [],
        video: VideoStore.get('video')
      };
    },
    componentDidMount: function() {
      // show related videos on page load
      this._fetchSnippets('');

      // cache initial video
      this._cacheVideo(this.state.video);

      // infinite scroll
      this._throttledOnScroll = throttle(this._onScroll, SCROLL_THROTTLE_DELAY);
      window.addEventListener('scroll', this._throttledOnScroll);

      // setup history management
      this.hm = new HistoryManager(this.state.video, this.state.video.title);
      this.hm.onSwitch(this._onHistorySwitch);
    },
    componentWillUnmount: function() {
      window.removeEventListener('scroll', this._throttledOnScroll);
    },
    _enableInfiniteScroll: function() {
      this._infiniteScrollEnabled = true;
    },
    _disableInfiniteScroll: function() {
      this._infiniteScrollEnabled = false;
    },
    _isInfiniteScrollEnabled: function() {
      return this._infiniteScrollEnabled;
    },
    _onScroll: function() {
      if (!this._isInfiniteScrollEnabled()) {
        return;
      }
      var remainingScroll = getDocHeight() - window.scrollY - window.innerHeight;
      if (remainingScroll <= INFINITE_SCROLL_BUFFER) {
        this._disableInfiniteScroll();
        this._fetchMoreSnippets();
      }
    },
    _onHistorySwitch: function(event) {
      this.setState({video: event.state});
    },
    render: function() {
      return (
        <MultiColumn>
          <Column className="sticky-column" size={7} push={5}>
            <YoutubePlayerContainer
              video={this.state.video}
              onSwitchVideo={this._fetchAndSetVideo}
            />
          </Column>
          <Column size={5}>
            <SearchableSnippetList
              isLoading={this.state.isLoading}
              videoList={this.state.snippets}
              selectedVideoID={this.state.video.id}
              onSearch={this._fetchSnippets}
              onSnippetClick={this._setVideo}
            />
          </Column>
        </MultiColumn>
      );
    },
    // Called when the user clicks on a suggestion from inside the player.
    _fetchAndSetVideo: function(videoID) {
      var cachedVideo = VideoCacheStore.get(videoID);
      if (cachedVideo) {
        this._setVideo(cachedVideo);
      } else {
        this.hm.push({id: videoID}, 'Loading...', URL.video(videoID));
        API.one(videoID, function(video) {
          this._setVideo(video, true);
          // show related videos
          API.related(videoID, this._setSnippets);
        }.bind(this));
      }
    },
    _setVideo: function(video, replaceState) {
      this.setState({video: video});
      if (replaceState) {
        this.hm.replace(video, video.title, video.url);
      } else {
        this.hm.push(video, video.title, video.url);
      }
    },
    _fetchSnippets: function(query) {
      this.setState({isLoading: true});
      this.api && this.api.abandon();
      if (query) {
        this.api = API.search(query, this._setSnippets);
      } else {
        var videoID = this.state.video.id;
        if (videoID) {
          this.api = API.related(videoID, this._setSnippets);
        }
      }
    },
    _fetchMoreSnippets: function() {
      if (this.api) {
        this.api.abandon();
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
      this.setState({
        isLoading: false,
        snippets: this.state.snippets.concat(videos)
      }, this._enableInfiniteScroll);
    },
    _cacheVideo: function(video) {
      VideoCacheStore.set(video.id, video);
    }
  });

})(this);
