/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.ViewPage = React.createClass({
    displayName: 'ViewPage',
    getInitialState: function() {
      return {
        isLoading: false,
        snippets: [],
        video: GlobalStore.get('video')
      };
    },
    componentDidMount: function() {
      // show related videos on page load
      this._fetchSnippets('');

      // put initial video in the videoMap
      this._cacheVideo(this.state.video);

      // setup history management
      this.hm = new HistoryManager(this.state.video, this.state.video.title);
      this.hm.onSwitch(this._onHistorySwitch);
    },
    _onHistorySwitch: function(event) {
      this.setState({video: event.state});
    },
    render: function() {
      var video = this.state.video;
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
              onSearch={this._fetchSnippets}
              onSnippetClick={this._setVideo}
            />
          </Column>
        </MultiColumn>
      );
    },
    // Called when the user clicks on a suggestion from inside the player.
    _fetchAndSetVideo: function(videoID) {
      var cachedVideo = this.videoMap[videoID];
      if (cachedVideo) {
        this._setVideo(cachedVideo);
      } else {
        this.hm.push({id: videoID}, undefined, URL.video(videoID));
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
    _setSnippets: function(videos) {
      // TODO: add proper utilisation of pagination
      // this.api.next(this._appendSnippets);
      delete this.api;
      videos.forEach(this._cacheVideo);
      this.setState({
        isLoading: false,
        snippets: videos
      });
    },
    _appendSnippets: function(videos) {
      videos.forEach(this._cacheVideo);
      this.setState({
        isLoading: false,
        snippets: this.state.snippets.concat(videos)
      });
    },
    _cacheVideo: function(video) {
      if (!this.videoMap) {
        this.videoMap = {};
      }
      this.videoMap[video.id] = video;
    }
  });

})(this);
