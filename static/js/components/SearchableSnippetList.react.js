var CSS = require('../util/CSS');
var colClass = require('./Layout.react').colClass;
var React = require('React');
var SearchBox = require('./SearchBox.react');
var SnippetList = require('./SnippetList.react');
var Spinner = require('./Spinner.react');

var SearchableSnippetList = React.createClass({
  displayName: 'SearchableSnippetList',
  propTypes: {
    isLoading: React.PropTypes.bool,
    selectedVideoID: React.PropTypes.string,
    videoList: React.PropTypes.array.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    onSnippetClick: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      isLoading: false
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.isLoading !== this.props.isLoading ||
      nextProps.videoList !== this.props.videoList ||
      nextProps.selectedVideoID !== this.props.selectedVideoID;
  },
  setQuery: function(query) {
    this.refs.searchbox.setQuery(query);
  },
  render: function() {
    return (
      <div className="snippet-list-section">
        <SearchBox
          ref="searchbox"
          className={CSS.join('sticky-search-box-section', colClass(5))}
          data-background="transparent"
          onSearch={this.props.onSearch}
        />
        <div className="snippet-list-container">
          <SnippetList
            data-border={this.props.isLoading ? null : "all"}
            videoList={this.props.videoList}
            selectedVideoID={this.props.selectedVideoID}
            onSnippetClick={this.props.onSnippetClick}
          />
          <Spinner
            className={CSS.join('snippet-list-spinner', colClass(5))}
            shown={this.props.isLoading}
          />
        </div>
      </div>
      );
  }
});

module.exports = SearchableSnippetList;
