/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;
  const COL_CLASS_PREFIXES = ['col-xs-', 'col-sm-', 'col-md-', 'col-lg-'];

  global.MultiColumn = React.createClass({
    displayName: 'MultiColumn',
    render: function() {
      return this.transferPropsTo(<div className="row">{this.props.children}</div>);
    }
  });

  global.Column = React.createClass({
    displayName: 'Column',
    propType: {
      size: PropTypes.number.isRequired
    },
    render: function() {
      var classes = COL_CLASS_PREFIXES.map(function(cls) {
        return cls + String(this.props.size);
      }, this);
      return this.transferPropsTo(
        <div className={classes.join(' ')}>{this.props.children}</div>
      );
    }
  });

})(this);
