/** @jsx React.DOM */

(function(global) {

  var PropTypes = React.PropTypes;

  global.SearchBox = React.createClass({
    propTypes: {
      query: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired
    },
    render: function() {
      return (
        <div className={"search-box-section bkgnd " + colClass(5)}>
          <div className="search-box-container">
            <input
              className="form-control search-box-input"
              dir="auto"
              type="text"
              placeholder="Search ..."
              value={this.props.query}
              onChange={this.props.onChange}
            />
            <SearchBoxDecoration />
          </div>
        </div>
      );
    }
  });

  var SearchBoxDecoration = React.createClass({
    render: function() {
      return <div className="search-box-decoration" />;
      /*
      // decoration with rounded corners
      return (
        <div className="search-box-decoration">
          <div className="search-box-corner corner-left">
            <div className="corner-fill-radius">
              <div className="corner-thin-border" />
            </div>
          </div>
          <div className="search-box-corner corner-right">
            <div className="corner-fill-radius">
              <div className="corner-thin-border" />
            </div>
          </div>
        </div>
      );
      */
    }
  });

})(this);
