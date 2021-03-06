var React = require('react');
var throttle = require('../util/throttle');

var InfiniteScroll = React.createClass({
  propTypes: {
    buffer: React.PropTypes.number.isRequired,
    throttle: React.PropTypes.number.isRequired,
    enableOnMount: React.PropTypes.bool.isRequired,
    checkOnEnable: React.PropTypes.bool.isRequired,
    onTrigger: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      buffer: 400,
      throttle: 100,
      enableOnMount: false,
      checkOnEnable: true,
    };
  },

  componentWillMount() {
    this._throttledOnScroll = throttle(this._check, this.props.throttle);
  },

  componentDidMount() {
    window.addEventListener('scroll', this._throttledOnScroll);
    this.props.enableOnMount && this.enable();
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this._throttledOnScroll);
    this._throttledOnScroll.cancel();
    delete this._throttledOnScroll;
  },

  isEnabled() {
    return this._enabled;
  },

  enable() {
    this._enabled = true;
    this.props.checkOnEnable && this._check();
  },

  disable() {
    this._enabled = false;
  },

  render() {
    // TODO: make it so that it doesn't take any children.
    return React.Children.only(this.props.children);
  },

  _getDocHeight() {
    var body = document.body;
    var docElem = document.documentElement;

    return Math.max(
      body.scrollHeight, body.offsetHeight,
      docElem.clientHeight, docElem.scrollHeight, docElem.offsetHeight
    );
  },

  _check() {
    if (!this._enabled) {
      return;
    }
    var remainingScroll = this._getDocHeight() - window.scrollY - window.innerHeight;
    if (remainingScroll <= this.props.buffer) {
      this.props.onTrigger();
    }
  },
});

module.exports = InfiniteScroll;
