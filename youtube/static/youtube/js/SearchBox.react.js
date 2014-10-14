/** @jsx React.DOM */

(function(global) {
  var API = require('API');
  var React = require('React');

  var PropTypes = React.PropTypes;

  const CLEAN_REGEX = /\s+/g;
  function cleanQuery(query) {
    return query.trim().replace(CLEAN_REGEX, ' ');
  }

  var NubHider = React.createClass({
    displayName: 'NubHider',
    render: function() {
      return <div className="search-box-nub-hider bkgnd" />;
    }
  });

  var InputBox = global.InputBox = React.createClass({
    displayName: 'InputBox',
    propTypes: {
      query: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onKeyDown: PropTypes.func
    },
    getInputDOMNode: function() {
      return this.refs.input.getDOMNode();
    },
    render: function() {
      return this.transferPropsTo(
        <div>
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
    }
  });

  global.SearchBox = React.createClass({
    displayName: 'SearchBox',
    propTypes: {
      onSearch: PropTypes.func.isRequired
    },
    getInitialState: function() {
      return {
        query: ''
      };
    },
    componentDidMount: function() {
      this._onSearchDebounced = debounce(this.props.onSearch, 500);

      $(this.refs.input.getInputDOMNode()).typeahead(
        {hint: false, minLength: 2},
        {displayKey: 'value', source: this._onAutocomplete}
      ).on(
        'typeahead:selected typeahead:autocompleted',
        this._onTypeaheadSelected
      );
    },
    componentWillUnmount: function() {
      this._onSearchDebounced.cancel();
      delete this._onSearchDebounced;

      $(this.refs.input.getInputDOMNode()).typeahead('destroy');
    },
    _onAutocomplete: function(query, process) {
      API.autocomplete(query, function(results) {
        process(results.map(function(result) {
          return {value: result};
        }));
      });
    },
    setQuery: function(query) {
      this.setState({query: query});
    },
    render: function() {
      return this.transferPropsTo(
        <InputBox
          ref="input"
          query={this.state.query}
          onChange={this._onChange}
          onKeyDown={this._onDown}
        />
      );
    },
    _onDown: function(event) {
      // When the user presses Enter => close the autocomplete dropdown
      if (event.key === 'Enter') {
        $(this.refs.input.getInputDOMNode()).typeahead('close');
      }
    },
    _onTypeaheadSelected: function(_, suggestion) {
      var query = suggestion.value;
      if (this._setQueryIfDifferent(query)) {
        this.props.onSearch(cleanQuery(query));
      }
    },
    _onChange: function(event) {
      var query = event.target.value;
      if (this._setQueryIfDifferent(query)) {
        this._onSearchDebounced(cleanQuery(query));
      }
    },
    _setQueryIfDifferent: function(query) {
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
    }
  });

})(MODULES);
