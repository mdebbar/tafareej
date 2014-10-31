var CSS = require('../util/CSS');
var React = require('React');

var Spinner = React.createClass({
  displayName: 'Spinner',
  propTypes: {
    shown: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      shown: true
    };
  },
  render: function() {
    var classes = CSS.join({
      spinner: true,
      nodisplay: !this.props.shown
    });
    // transferPropsTo() is required in case we pass ID or style.
    return this.transferPropsTo(<div className={classes}></div>);
  }
});

module.exports = Spinner;
