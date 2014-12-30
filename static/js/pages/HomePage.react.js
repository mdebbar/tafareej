// CSS
require('../../css/bootstrap.css');
require('../../css/global.css');
require('../../css/flat.am.css');
require('../../css/search-box.css');

var HistoryManager = require('../HistoryManager');
var InfiniteScroll = require('../components/InfiniteScroll.react');
var React = require('react');
var VideoDataStore = require('../flux/VideoDataStore');
var VideoResultsStore = require('../flux/VideoResultsStore');
var SearchBox = require('../components/SearchBox.react');
var Subscriptions = require('../mixins/Subscriptions');
var URI = require('../util/URI');
var VideoGrid = require('../components/VideoGrid.react');

var PropTypes = React.PropTypes;
var PAGE_SIZE = 15;

var HomePage = React.createClass({
  mixins: [Subscriptions],

  propTypes: {
    siteName: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      // Get query from URL or load popular videos
      query: new URI().getParam('q') || '',
      limit: PAGE_SIZE,
    };
  },

  getSubscriptions() {
    return [
      VideoResultsStore.subscribe(() => this.forceUpdate()),
    ];
  },

  componentDidMount() {
    this.updateHistory(this.state);
    // setup history management
    HistoryManager.onSwitch(this.onHistorySwitch);

    this.refs.search.setQuery(this.state.query);
    this.newSearch(this.state.query);
  },

  componentWillUpdate(nextProps: Object, nextState: Object) {
    if (nextState.query !== this.state.query) {
      // Scroll to the top
      window.scrollTo(0, 0);
      this.updateHistory(nextState);
    }
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

  getPageTitle(query) {
    if (query) {
      return this.props.siteName + ' - ' + query;
    }
    return this.props.siteName;
  },

  updateHistory({query}) {
    HistoryManager.replace(
      {query},
      this.getPageTitle(query),
      this.buildURL(query)
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
    var {query} = event.state;
    this.refs.search.setQuery(query);
    this.newSearch(query);
  },

  getVideoIDs({query, limit}) {
    return query
      ? VideoResultsStore.getSearchVideos(query, 0, limit)
      : VideoResultsStore.getPopularVideos(0, limit);
  },

  render() {
    var videos = this.getVideoIDs(this.state).map(id => VideoDataStore.getVideoByID(id));
    return (
      <div>
        <SearchBox
          ref="search"
          className="sticky-centered-search-box"
          data-background="transparent"
          onSearch={this.newSearch}
        />
        <InfiniteScroll
          ref="scroller"
          buffer={800}
          onTrigger={this.paginate}>
          <VideoGrid
            isLoading={videos.size === 0}
            videos={videos}
          />
        </InfiniteScroll>
      </div>
    );
  },

  buildURL(query) {
    var url = new URI();
    return query ? url.setParam('q', query) : url.removeParam('q');
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


React.render(
  <HomePage siteName={Server.siteName} />,
  DOM.reactPage
);


module.exports = HomePage;
