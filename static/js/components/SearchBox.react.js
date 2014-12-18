// CSS
require('../../css/typeaheadjs.css');
require('../../css/search-box.css');

var API = require('../API');
var BloodhoundEngine = require('../util/BloodhoundEngine');
var React = require('react');

var debounce = require('../util/debounce');


const CLEAN_REGEX = /\s+/g;
function cleanQuery(query) {
  return query.trim().replace(CLEAN_REGEX, ' ');
}

var NubHider = React.createClass({
  render() {
    return <div className="search-box-nub-hider" data-background="transparent" />;
  },
});

var InputBox = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func,
  },

  getInputDOMNode() {
    return this.refs.input.getDOMNode();
  },

  render() {
    return (
      <div {...this.props}>
        <NubHider />
        <div className="search-box-container">
          <input
            ref="input"
            className="form-control search-box-input"
            dir="auto"
            type="text"
            autocomplete="off"
            placeholder="Search"
            value={this.props.query}
            onKeyDown={this.props.onKeyDown}
            onChange={this.props.onChange}
          />
          <span className="search-icon glyphicon glyphicon-search" />
        </div>
      </div>
    );
  },
});

var SearchBox = React.createClass({
  propTypes: {
    onSearch: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      query: '',
    };
  },

  componentDidMount() {
    BloodhoundEngine.initialize();
    this._onSearchDebounced = debounce(this.props.onSearch, 500);

    // TODO: implement my own typeahead
    $(this.refs.input.getInputDOMNode()).typeahead(
      {hint: false, minLength: 2},
      {displayKey: 'value', source: BloodhoundEngine.ttAdapter()}
    ).on(
      'typeahead:selected typeahead:autocompleted',
      this._onTypeaheadSelected
    );
  },

  componentWillUnmount() {
    this._onSearchDebounced.cancel();
    delete this._onSearchDebounced;

    $(this.refs.input.getInputDOMNode()).typeahead('destroy');
  },

  setQuery(query) {
    this.setState({query});
  },

  render() {
    return (
      <InputBox
        {...this.props}
        ref="input"
        query={this.state.query}
        onChange={this._onChange}
        onKeyDown={this._onDown}
      />
    );
  },

  _onDown(event) {
    // When the user presses Enter => close the autocomplete dropdown
    if (event.key === 'Enter') {
      $(this.refs.input.getInputDOMNode()).typeahead('close');
    }
  },

  _onTypeaheadSelected(_, {value}) {
    if (this._setQueryIfDifferent(value)) {
      this.props.onSearch(cleanQuery(value));
    }
  },

  _onChange(event) {
    if (this._setQueryIfDifferent(event.target.value)) {
      this._onSearchDebounced(cleanQuery(event.target.value));
    }
  },

  _setQueryIfDifferent(query) {
    // Exact same query
    if (query == this.state.query) {
      return false;
    }
    // Query with the exact same effect
    if (cleanQuery(query) == cleanQuery(this.state.query)) {
      this.setQuery(query);
      return false;
    }
    this.setQuery(query);
    return true;
  },
});

module.exports = SearchBox;
