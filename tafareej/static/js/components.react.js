/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;
  const COL_CLASS_PREFIXES = ['col-xs-', 'col-sm-', 'col-md-', 'col-lg-'];

  global.MultiColumn = ReactSimple(function() {
    return this.transferPropsTo(<div className="row">{this.props.children}</div>);
  });

  global.Column = ReactSimple(
    {size: PropTypes.number.isRequired},
    function() {
      var classes = COL_CLASS_PREFIXES.map(function(cls) {
        return cls + String(this.props.size);
      }, this);
      return this.transferPropsTo(
        <div className={classes.join(' ')}>
          {this.props.children}
        </div>
      );
    }
  );

})(this);
