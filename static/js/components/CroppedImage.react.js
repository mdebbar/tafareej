// CSS dependencies
require('../../css/cropped-image.css');

var CSS = require('../util/CSS');
var React = require('react');

var PropTypes = React.PropTypes;

var CroppedImage = React.createClass({
  propTypes: {
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,

    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    cropWidth: PropTypes.number.isRequired,
    cropHeight: PropTypes.number.isRequired,
  },

  render: function() {
    return (
      <div {...this.props} style={this.getWrapperStyle()}>
        <div
          className="cropped-image-container"
          style={this.getContainerStyle()}>
          <img
            className="cropped-image"
            style={this.getImageStyle()}
            src={this.props.src}
            width={this.props.width} />
        </div>
      </div>
    );
  },

  getWrapperStyle() {
    return {
      width: this.props.width,
    };
  },

  getContainerStyle() {
    return {
      top: this.props.top,
      left: this.props.left,
      width: this.props.cropWidth,
      height: this.props.cropHeight,
    };
  },

  getImageStyle() {
    return {
      top: -this.props.top,
      left: -this.props.left,
    };
  },
});

module.exports = CroppedImage;
