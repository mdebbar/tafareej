var React = require('react');

// TODO: implement prefetching
var ImageSwitcher = React.createClass({
  propTypes: {
    images: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    duration: React.PropTypes.number.isRequired,
    enabled: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      duration: 1000,
      enabled: true,
    };
  },

  getInitialState() {
    return {
      index: 0,
    };
  },

  componentDidMount() {
    if (this.props.enabled) {
      this.startSwitching();
    }
  },

  componentWillReceiveProps(nextProps) {
    if (!this.props.enabled && nextProps.enabled) {
      this.startSwitching();
    }
    if (this.props.enabled && !nextProps.enabled) {
      this.stopSwitching();
      this.setState({index: 0});
    }
  },

  componentWillUnmount() {
    this.stopSwitching();
  },

  startSwitching() {
    if (this.imageSwitcher) {
      return;
    }
    this.imageSwitcher = setInterval(this.switchImage, this.props.duration);
    this.switchImage();
  },

  stopSwitching() {
    if (!this.imageSwitcher) {
      return;
    }
    this.imageSwitcher && clearInterval(this.imageSwitcher);
    delete this.imageSwitcher;
  },

  switchImage() {
    var newIndex = (this.state.index + 1) % this.props.images.length;
    this.setState({index: newIndex});
  },

  render() {
    var {images, duration, enabled, ...other} = this.props;
    return (
      <img {...other} src={this.props.images[this.state.index]} />
    );
  },
});

module.exports = ImageSwitcher;
