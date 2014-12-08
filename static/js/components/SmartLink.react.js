var React = require('React');

var SmartLink = React.createClass({
  propTypes: {
    href: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
  },

  render() {
    return this.transferPropsTo(
      <a href={this.props.href} onClick={this._onClick}>
        {this.props.children}
      </a>
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
