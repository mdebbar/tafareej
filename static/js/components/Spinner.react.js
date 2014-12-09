var CSS = require('../util/CSS');
var React = require('react');

var Spinner = React.createClass({
  propTypes: {
    shown: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      shown: true,
    };
  },

  render() {
    var className = CSS.join(
      this.props.className,
      'spinner',
      {nodisplay: !this.props.shown}
    );
    return <div {...this.props} className={className}></div>;
  },
});

module.exports = Spinner;
