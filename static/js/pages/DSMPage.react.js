// CSS dependencies
require('../../css/bootstrap.css');
require('../../css/dsm.css');

var React = require('react');
var CroppedImage = require('../components/CroppedImage.react');
var Draggable = require('../components/Draggable.react');

// images
var Images = {
  ortho: require('../../img/ortho.png'),
  dsm: require('../../img/dsm.png'),
};

var PropTypes = React.PropTypes;

var RATIO = 1.115;
var WIDTH = 400;
var HEIGHT = Math.floor(WIDTH * RATIO);
var INITIAL_CROP_SIZE = Math.floor(WIDTH * 0.5);

var ZOOM_RATIO = 1.1;

var DSMPage = React.createClass({
  getInitialState() {
    return {
      cropSize: INITIAL_CROP_SIZE,
      top: Math.floor((HEIGHT - INITIAL_CROP_SIZE) / 2),
      left: Math.floor((WIDTH - INITIAL_CROP_SIZE) / 2),
    };
  },

  render() {
    return (
      <div className="dsm-container" style={{width: WIDTH, height: HEIGHT}}>
        <img className="ortho-image" src={Images.ortho} />
        <Draggable onDrag={this._onDrag}>
          <CroppedImage
            className='dsm-image'
            src={Images.dsm}
            width={WIDTH}
            top={this.state.top}
            left={this.state.left}
            cropWidth={this.state.cropSize}
            cropHeight={this.state.cropSize} />
        </Draggable>

        <div className="zoom-controls">
          <button className="btn btn-default" onClick={this._onZoomIn}>+</button>
          <button className="btn btn-default" onClick={this._onZoomOut}>-</button>
        </div>
      </div>
    );
  },

  _onZoomIn() {
    var oldSize = this.state.cropSize;
    // Enforce a max size for the DSM viewer to the total width of the image.
    var newSize = Math.min(WIDTH, Math.floor(oldSize * ZOOM_RATIO));
    this.setState({
      cropSize: newSize,
    });
    this._adjustPositionAfterZoom(oldSize, newSize);
  },

  _onZoomOut() {
    var oldSize = this.state.cropSize;
    // Enforce a min size for the DSM viewer to 50px.
    var newSize = Math.max(50, Math.floor(oldSize / ZOOM_RATIO));
    this.setState({
      cropSize: newSize,
    });
    this._adjustPositionAfterZoom(oldSize, newSize);
  },

  /**
   * Adjust the position of the DSM viewer so the zoom looks centered.
   */
  _adjustPositionAfterZoom(oldSize, newSize) {
    var adjustment = Math.floor((newSize - oldSize) / 2);
    this.setState({
      top: this._calcAxeValue(this.state.top, -adjustment, HEIGHT, newSize / 2),
      left: this._calcAxeValue(this.state.left, -adjustment, WIDTH, newSize / 2),
    });
  },

  /**
   * The DSM viewer has been dragged.
   * x and y comprise the distance dragged.
   */
  _onDrag(x, y) {
    var {top: oldTop, left: oldLeft} = this.state;
    var newTop = this._calcAxeValue(this.state.top, y, HEIGHT, this.state.cropSize / 2);
    var newLeft = this._calcAxeValue(this.state.left, x, WIDTH, this.state.cropSize / 2);

    if (newTop !== oldTop || newLeft !== oldLeft) {
      this.setState({
        top: newTop,
        left: newLeft,
      });
    }
  },

  /**
   * Calculate the X or Y value so that the DSM viewer circle doesn't go
   * outside the original image.
   */
  _calcAxeValue(origVal, diff, total, radius) {
    var diameter = radius * 2;
    var length = Math.sqrt(Math.pow(radius, 2) / 2);
    var maxOverflow = Math.ceil(radius - length);
    return clip(origVal + diff, -maxOverflow, total - diameter + maxOverflow);
  },
});

function clip(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

React.render(
  <DSMPage />,
  window.DOM.reactPage
);

module.exports = DSMPage;
