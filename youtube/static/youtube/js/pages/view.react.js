/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.ViewPage = React.createClass({
    displayName: 'ViewPage',
    getInitialState: function() {
      var video = GlobalStore.get('video');
      // put initial video in the videoMap
      var videoMap = {};
      videoMap[video.id] = video;

      return {
        isLoading: false,
        snippets: [],
        video: video,
        videoMap: videoMap
      };
    },
    componentDidMount: function() {
      document.title = this.state.video.title;
      // show related videos on page load
      this._onSearch('');
    },
    render: function() {
      var video = this.state.video;
      return (
        <MultiColumn>
          <Column size={7} push={5}>
            <YoutubePlayerContainer
              video={this.state.video}
              onSwitchVideo={this._onSwitchVideo}
            />
          </Column>
          <Column size={5} pull={7}>
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
    _onSwitchVideo: function(videoID) {
      var cachedVideo = this.state.videoMap[videoID];
      if (cachedVideo) {
        this._onVideo(cachedVideo);
      } else {
        API.one(videoID, function(video) {
          this._onVideo(video);
          // show related videos
          API.related(videoID, this._onSearchResults);
        }.bind(this));
      }
    },
    _onVideo: function(video) {
      document.title = video.title;
      this.setState({video: video});
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
      videos.forEach(function(video) {
        this.state.videoMap[video.id] = video;
      }, this);
      this.setState({
        isLoading: false,
        snippets: videos
      });
    }
  });

})(this);
