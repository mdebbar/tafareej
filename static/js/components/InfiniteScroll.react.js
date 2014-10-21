/** @jsx React.DOM */

var React = require('React');
var throttle = require('../util/throttle');

var InfiniteScroll = React.createClass({
  displayName: 'InfiniteScroll',
  propTypes: {
    buffer: React.PropTypes.number,
    throttle: React.PropTypes.number,
    onTrigger: React.PropTypes.func.isRequired
  },
  getDefaultProps: function() {
    return {
      buffer: 400,
      throttle: 100
    };
  },
  componentWillMount: function() {
    this._throttledOnScroll = throttle(this._onScroll, this.props.throttle);
  },
  componentDidMount: function() {
    window.addEventListener('scroll', this._throttledOnScroll);
    this._enabled = true;
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this._throttledOnScroll);
    this._throttledOnScroll.cancel();
    delete this._throttledOnScroll;
  },
  enable: function() {
    this._enabled = true;
  },
  disable: function() {
    this._enabled = false;
  },
  render: function() {
    return React.Children.only(this.props.children);
  },
  _getDocHeight: function() {
    var body = document.body;
    var docElem = document.documentElement;

    return Math.max(
      body.scrollHeight, body.offsetHeight,
      docElem.clientHeight, docElem.scrollHeight, docElem.offsetHeight
    );
  },
  _onScroll: function() {
    if (!this._enabled) {
      return;
    }
    var remainingScroll = this._getDocHeight() - window.scrollY - window.innerHeight;
    if (remainingScroll <= this.props.buffer) {
      this.props.onTrigger();
    }
  }
});

module.exports = InfiniteScroll;
