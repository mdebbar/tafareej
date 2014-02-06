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
      this._onSearch('');

      // put initial video in the videoMap
      this._cacheVideo(this.state.video);

      // setup history management
      this.hm = new HistoryManager(this.state.video, this.state.video.title);
      this.hm.onSwitch(this._onSwitchPage);
    },
    _onSwitchPage: function(event) {
      this.setState({video: event.state});
    },
    render: function() {
      var video = this.state.video;
      return (
        <MultiColumn>
          <Column className="sticky-column" size={7} push={5}>
            <YoutubePlayerContainer
              video={this.state.video}
              onSwitchVideo={this._onSwitchVideo}
            />
          </Column>
          <Column size={5}>
            <SearchableSnippetList
              isLoading={this.state.isLoading}
              videoList={this.state.snippets}
              onSearch={this._onSearch}
              onSnippetClick={this._onVideo}
            />
          </Column>
        </MultiColumn>
      );
    },
    // Called when the user clicks on a suggestion from inside the player.
    _onSwitchVideo: function(videoID) {
      var cachedVideo = this.videoMap[videoID];
      if (cachedVideo) {
        this._onVideo(cachedVideo);
      } else {
        this.hm.push({id: videoID}, undefined, constructVideoURL(videoID));
        API.one(videoID, function(video) {
          this._onVideo(video, true);
          // show related videos
          API.related(videoID, this._onSearchResults);
        }.bind(this));
      }
    },
    _onVideo: function(video, replaceState) {
      this.setState({video: video});
      if (replaceState) {
        this.hm.replace(video, video.title, video.url);
      } else {
        this.hm.push(video, video.title, video.url);
      }
    },
    _onSearch: function(query) {
      this.setState({isLoading: true});
      this.api && this.api.abandon();
      if (query) {
        this.api = API.search(query, this._onSearchResults);
      } else {
        var videoID = this.state.video.id;
        if (videoID) {
          this.api = API.related(videoID, this._onSearchResults);
        }
      }
    },
    _onSearchResults: function(videos) {
      delete this.api;
      videos.forEach(this._cacheVideo);
      this.setState({
        isLoading: false,
        snippets: videos
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