// CSS
require('../../css/bootstrap.css');
require('../../css/global.css');
require('../../css/flat.am.css');

var Actions = require('../flux/Actions');
var API = require('../API');
var HistoryManager = require('../HistoryManager');
var InfiniteScroll = require('../components/InfiniteScroll.react');
var Layout = require('../components/Layout.react');
var React = require('react');
var SearchableSnippetList = require('../components/SearchableSnippetList.react');
var VideoResultsStore = require('../flux/VideoResultsStore');
var VideoDataStore = require('../flux/VideoDataStore');
var URI = require('../util/URI');
var URL = require('../util/URL');
var YoutubePlayerContainer = require('../components/YoutubePlayerContainer.react');


var Column = Layout.Column;
var MultiColumn = Layout.MultiColumn;

var VideoPage = React.createClass({
  propTypes: {
    autoplay: React.PropTypes.bool,
    initialVideo: React.PropTypes.shape({
      id: React.PropTypes.string,
      title: React.PropTypes.string,
      url: React.PropTypes.string,
    }).isRequired,
  },

  getInitialState() {
    return {
      isLoading: false,
      snippets: [],
      video: this.props.initialVideo,
    };
  },

  componentDidMount() {
    // Initial history state will be set in _onSearch()
    HistoryManager.onSwitch(this._onHistorySwitch);

    this._subscriptions = [
      VideoResultsStore.subscribe(this._onStoreChange),
    ];

    // use initial query on page load
    // TODO: Move this logic to a store
    var query = new URI().getParam('q') || HistoryManager.getState().query || '';
    this.refs.searchable.setQuery(query);
    this._onSearch(query);
  },

  _onStoreChange() {
    console.log('changed!', arguments);
    if (this._query)
      console.log(VideoResultsStore.getSearchVideos(this._query));
    else
      console.log(VideoResultsStore.getRelatedVideos(this.state.video.id));
  },

  componentWillUnmount() {
    this._subscriptions.forEach(sub => sub.release());
  },

  _enableInfiniteScroll() {
     this.refs.scroller.enable();
  },

  _disableInfiniteScroll() {
     this.refs.scroller.disable();
  },

  _onHistorySwitch(event) {
    var {query, video} = event.state;
    this.setState({video});
    this.refs.searchable.setQuery(query);
    this._onSearch(query);
  },

  render() {
    return (
      <MultiColumn>
        <Column className="sticky-column" size={7} push={5}>
          <YoutubePlayerContainer
            className="youtube-player-absolute"
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

  _buildURL(videoID, query) {
    var params = new URI().getParams();
    var url = new URI(URL.video(videoID)).setParams(params);
    return query ? url.setParam('q', query) : url.removeParam('q');
  },

  _search(query) {
    this._disableInfiniteScroll();
    this.setState({isLoading: true});
    this.api && this.api.abandon();
    this.api = API.search(query, this._setSnippets);
  },

  _related(videoID) {
    this._disableInfiniteScroll();
    this.setState({isLoading: true});
    this.api && this.api.abandon();
    this.api = API.related(videoID, this._setSnippets);
  },

  // Called when the user clicks on a suggestion from inside the player.
  _videoSelectedFromPlayer(videoID) {
    // Clear search query
    this.refs.searchable.setQuery('');
    this._query = '';

    var cachedVideo = VideoDataStore.getVideoByID(videoID);
    if (cachedVideo) {
      this._setVideo(cachedVideo);
      // show related videos
      this._related(videoID);
    } else {
      HistoryManager.push(
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

  _setVideo(video, replaceState) {
    this.setState({video});
    var historyState = {video, query: this._query};
    var historyURL = this._buildURL(video.id, this._query);
    if (replaceState) {
      HistoryManager.replace(historyState, video.title, historyURL);
    } else {
      HistoryManager.push(historyState, video.title, historyURL);
    }
  },

  _onSearch(query) {
    this._query = query;

    HistoryManager.replace(
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

  _fetchMoreSnippets() {
    if (this.api && typeof this.api.next === 'function') {
      this.api = this.api.next(this._appendSnippets);
    }
  },

  _setSnippets(videos) {
    this.setState({
      isLoading: false,
      snippets: videos,
    }, this._enableInfiniteScroll);
  },

  _appendSnippets(videos) {
    if (!Array.isArray(videos) || videos.length === 0) {
      return;
    }
    this.setState(
      {snippets: this.state.snippets.concat(videos)},
      this._enableInfiniteScroll
    );
  },
});

// Add the initial video to the VideoDataStore
Actions.receiveVideoData(Server.initialVideo);

React.render(
  <VideoPage
    initialVideo={Server.initialVideo}
    autoplay={Server.autoplay}
  />,
  DOM.reactPage
);


module.exports = VideoPage;
