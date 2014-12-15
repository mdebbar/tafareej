// CSS
require('../../css/bootstrap.css');
require('../../css/global.css');
require('../../css/flat.am.css');

var Actions = require('../flux/Actions');
var API = require('../API');
var HistoryManager = require('../HistoryManager');
var Immutable = require('immutable');
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
    initialVideoID: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      isLoading: false,
      snippets: [],
      videoID: this.props.initialVideoID,
    };
  },

  componentDidMount() {
    // Initial history state will be set in _onSearch()
    HistoryManager.onSwitch(this._onHistorySwitch);

    this._subscriptions = [
      VideoDataStore.subscribe(this._update),
      VideoResultsStore.subscribe(this._onStoreChange),
    ];

    // use initial query on page load
    // TODO: Move this logic to a store
    var query = new URI().getParam('q') || HistoryManager.getState().query || '';
    this.refs.searchable.setQuery(query);
    this._onSearch(query);
  },

  componentWillUpdate(nextProps: Object, nextState: Object) {
    // Switching to a new video.
    if (this.state.videoID !== nextState.videoID) {
      this.updateHistory(nextState.videoID, this._query);
    }

    // We now have data for a video that was not available before.
    // if (we have video data now but didn't have it before) {
    //   this.updateHistory(nextState.videoID, this._query, true);
    // }
  },

  componentWillUnmount() {
    this._subscriptions.forEach(sub => sub.release());
  },

  // TODO: Move all history-related logic to the history store.
  updateHistory(videoID: string, query: string, replace?: boolean) {
    var method = replace ? 'replace' : 'push';
    HistoryManager[method](
      {videoID, query},
      VideoDataStore.getVideoByID(videoID).get('title'),
      this._buildURL(videoID, query)
    );
  },

  _onStoreChange() {
    console.log('changed!', arguments);
    if (this._query)
      console.log(VideoResultsStore.getSearchVideos(this._query));
    else
      console.log(VideoResultsStore.getRelatedVideos(this.state.videoID));
  },

  _update() {
    this.forceUpdate();
  },

  _enableInfiniteScroll() {
     this.refs.scroller.enable();
  },

  _disableInfiniteScroll() {
     this.refs.scroller.disable();
  },

  _onHistorySwitch(event) {
    var {query, videoID} = event.state;
    this.setState({videoID});
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
            video={VideoDataStore.getVideoByID(this.state.videoID)}
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
              selectedVideoID={this.state.videoID}
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

    this.setState({videoID});
    // this._related(videoID);
  },

  _setVideo(videoID) {
    this.setState({videoID});
  },

  _onSearch(query) {
    this._query = query;

    this.updateHistory(this.state.videoID, query, /*replace*/ true);
    if (query) {
      this._search(query);
    } else {
      this._related(this.state.videoID);
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
    initialVideoID={Server.initialVideo.id}
    autoplay={Server.autoplay}
  />,
  DOM.reactPage
);


module.exports = VideoPage;
