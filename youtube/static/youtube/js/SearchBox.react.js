/** @jsx React.DOM */

(function(global) {

  var PropTypes = React.PropTypes;

  var NubHider = React.createClass({
    displayName: 'NubHider',
    render: function() {
      return <div className="search-box-nub-hider bkgnd" />;
    }
  });

  global.SearchBox = React.createClass({
    displayName: 'SearchBox',
    propTypes: {
      query: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      onSelect: PropTypes.func.isRequired
    },
    componentDidMount: function() {
      $(this.refs.input.getDOMNode()).typeahead({
        hint: false,
        minLength: 2
      }, {
        displayKey: 'value',
        source: this._onAutocomplete
      }).on(
        'typeahead:selected typeahead:autocompleted',
        this._onTypeaheadSelected
      );
    },
    componentWillUnmount: function() {
      $(this.refs.input.getDOMNode()).typeahead('destroy');
    },
    _onAutocomplete: function(query, process) {
      API.autocomplete(query, function(results) {
        process(results.map(function(result) {
          return {value: result};
        }));
      });
    },
    _onTypeaheadSelected: function(_, suggestion) {
      this.props.onSelect(suggestion.value);
    },
    render: function() {
      return (
        <div className={'sticky-search-box-section bkgnd ' + colClass(5)}>
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
              onChange={this.props.onChange}
            />
            <span className="search-icon glyphicon glyphicon-search" />
          </div>
        </div>
      );
    }
  });

})(this);
