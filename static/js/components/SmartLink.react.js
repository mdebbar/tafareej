var React = require('react');

var SmartLink = React.createClass({
  propTypes: {
    href: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
  },

  render() {
    return (
      <a {...this.props} onClick={this._onClick} />
    );
  },

  _onClick(event) {
    // If it's a special click, let the default behavior happen.
    if (!this.props.onClick || event.ctrlKey || event.shiftKey || event.metaKey) {
      return;
    }
    event.preventDefault();
    this.props.onClick(event);
  },
});

module.exports = SmartLink;
