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
var Subscriptions = require('../mixins/Subscriptions');
var VideoResultsStore = require('../flux/VideoResultsStore');
var VideoDataStore = require('../flux/VideoDataStore');
var URI = require('../util/URI');
var URL = require('../util/URL');
var YoutubePlayerContainer = require('../components/YoutubePlayerContainer.react');


var Column = Layout.Column;
var MultiColumn = Layout.MultiColumn;

var PAGE_SIZE = 15;

var VideoPage = React.createClass({
  mixins: [Subscriptions],

  propTypes: {
    autoplay: React.PropTypes.bool,
    initialVideoID: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      // The video that is being watched.
      videoID: this.props.initialVideoID,
      // Show related videos for this video.
      relatedVideoID: this.props.initialVideoID,
      query: new URI().getParam('q') || HistoryManager.getState().query || '',
      limit: PAGE_SIZE,
    };
  },

  getSubscriptions() {
    return [
      VideoResultsStore.subscribe(() => this.forceUpdate()),
      VideoDataStore.subscribe(() => this.forceUpdate()),
    ];
  },

  componentDidMount() {
    this.updateHistory(this.state, true);
    HistoryManager.onSwitch(this.onHistorySwitch);

    // use initial query on page load
    // TODO: Move this logic to a store
    // var query = new URI().getParam('q') || HistoryManager.getState().query || '';
    this.refs.searchable.setQuery(this.state.query);
    this.newSearch(this.state.query);
  },

  componentWillUpdate(nextProps: Object, nextState: Object) {
    if (nextState.updateHistory && this.state.videoID !== nextState.videoID) {
      // Switching to a new video.
      this.updateHistory(nextState);
    } else if (this.state.query !== nextState.query) {
      // Scroll to the top
      window.scrollTo(0, 0);
      this.updateHistory(nextState, /*replace*/ true);
    }

    // We now have data for a video that was not available before.
    // if (we have video data now but didn't have it before) {
    //   this.updateHistory(nextState.videoID, nextState.query, /*replace*/ true);
    // }
  },

  componentDidUpdate() {
    if (this.isInfiniteScrollEnabled()) {
      return;
    }

    var wantedCount = this.state.limit;
    var availableCount = this.getVideoIDs(this.state).size;
    // If we are already showing enough videos, enable the infinite scroll
    if (availableCount >= wantedCount) {
      this.enableInfiniteScroll();
    }
  },

  // TODO: Move all history-related logic to the history store.
  updateHistory({videoID, query}, replace) {
    var method = replace ? 'replace' : 'push';
    HistoryManager[method](
      {videoID, query},
      VideoDataStore.getVideoByID(videoID).get('title'),
      this.buildURL(videoID, query)
    );
  },

  isInfiniteScrollEnabled() {
    this.refs.scroller.isEnabled();
  },

  enableInfiniteScroll() {
     this.refs.scroller.enable();
  },

  disableInfiniteScroll() {
     this.refs.scroller.disable();
  },

  onHistorySwitch(event) {
    var {query, videoID} = event.state;
    this.setState({
      videoID: videoID,
      updateHistory: false,
    });
    this.refs.searchable.setQuery(query);
    this.newSearch(query);
  },

  getVideoIDs({relatedVideoID, query, limit}) {
    return query
      ? VideoResultsStore.getSearchVideos(query, 0, limit)
      : VideoResultsStore.getRelatedVideos(relatedVideoID, 0, limit);
  },

  render() {
    var videos = this.getVideoIDs(this.state).map(id => VideoDataStore.getVideoByID(id));
    return (
      <MultiColumn>
        <Column className="sticky-column" size={7} push={5}>
          <YoutubePlayerContainer
            className="youtube-player-absolute"
            autoplay={this.props.autoplay}
            video={VideoDataStore.getVideoByID(this.state.videoID)}
            onSwitchVideo={this.setVideo}
          />
        </Column>
        <Column size={5}>
          <InfiniteScroll
            ref="scroller"
            buffer={800}
            onTrigger={this.paginate}>
            <SearchableSnippetList
              ref="searchable"
              isLoading={videos.size === 0}
              videoList={videos}
              selectedVideoID={this.state.videoID}
              onSearch={this.newSearch}
              onSnippetClick={this.setVideo}
            />
          </InfiniteScroll>
        </Column>
      </MultiColumn>
    );
  },

  buildURL(videoID, query) {
    var params = new URI().getParams();
    var url = new URI(URL.video(videoID)).setParams(params);
    return query ? url.setParam('q', query) : url.removeParam('q');
  },

  setVideo(videoID) {
    this.setState({
      videoID: videoID,
      updateHistory: true,
    });
  },

  newSearch(query) {
    this.disableInfiniteScroll();
    this.setState({
      query: query,
      limit: PAGE_SIZE,
    });
  },

  paginate() {
    this.disableInfiniteScroll();
    this.setState({
      limit: this.state.limit + PAGE_SIZE,
    });
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
