// CSS
require('../../css/bootstrap.css');
require('../../css/global.css');
require('../../css/flat.am.css');
require('../../css/search-box.css');

var API = require('../API');
var HistoryManager = require('../HistoryManager');
var InfiniteScroll = require('../components/InfiniteScroll.react');
var React = require('react');
var VideoResultsStore = require('../flux/VideoResultsStore');
var SearchBox = require('../components/SearchBox.react');
var URI = require('../util/URI');
var VideoGrid = require('../components/VideoGrid.react');

var PropTypes = React.PropTypes;

var HomePage = React.createClass({
  propTypes: {
    siteName: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      isLoading: false,
      videos: [],
    };
  },

  componentDidMount() {
    // setup history management
    HistoryManager.onSwitch(this._onHistorySwitch);

    VideoResultsStore.subscribe(this._onStoreChange);

    // Get query from URL or history state or load popular videos
    var query = new URI().getParam('q') || HistoryManager.getState().query || '';
    this.refs.search.setQuery(query);
    this._onSearch(query);
  },

  componentWillUnmount() {
    this._subscriptions.forEach(sub => sub.release());
  },

  _onStoreChange() {
    console.log('changed!', arguments);
    console.log(VideoResultsStore.getPopularVideos(this._query));
  },

  _getPageTitle(query) {
    if (query) {
      return this.props.siteName + ' - ' + query;
    }
    return this.props.siteName;
  },

  _enableInfiniteScroll() {
    this.refs.scroller.enable();
  },

  _disableInfiniteScroll() {
    this.refs.scroller.disable();
  },

  _onHistorySwitch(event) {
    var {query} = event.state;
    this.refs.search.setQuery(query);
    this._onSearch(query);
  },

  render() {
    return (
      <div>
        <SearchBox
          ref="search"
          className="sticky-centered-search-box"
          data-background="transparent"
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

  _search(query) {
    this._disableInfiniteScroll();
    this.setState({isLoading: true});
    this.api && this.api.abandon();
    this.api = API.search(query, this._setVideos);
  },

  _popular() {
    this._disableInfiniteScroll();
    this.setState({isLoading: true});
    this.api && this.api.abandon();
    this.api = API.popular(this._setVideos);
  },

  _buildURL(query) {
    var url = new URI();
    return query ? url.setParam('q', query) : url.removeParam('q');
  },

  _onSearch(query) {
    HistoryManager.replace(
      {query},
      this._getPageTitle(query),
      this._buildURL(query)
    );
    if (query) {
      this._search(query);
    } else {
      this._popular();
    }
  },

  _fetchMoreVideos() {
    if (this.api && typeof this.api.next === 'function') {
      this.api = this.api.next(this._appendVideos);
    }
  },

  _setVideos(videos) {
    this.setState({
      videos,
      isLoading: false,
    }, this._enableInfiniteScroll);
  },

  _appendVideos(videos) {
    if (!Array.isArray(videos) || videos.length === 0) {
      return;
    }
    this.setState(
      {videos: this.state.videos.concat(videos)},
      this._enableInfiniteScroll
    );
  },
});


React.render(
  <HomePage
    siteName={Server.siteName}
  />,
  DOM.reactPage
);


module.exports = HomePage;
