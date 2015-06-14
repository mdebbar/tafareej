var React = require('react');

var PropTypes = React.PropTypes;

/**
 * A component that makes its contents draggable.
 */
var Draggable = React.createClass({
  propTypes: {
    onDrag: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      isDragging: false,
      origX: 0,
      origY: 0,
    };
  },

  componentDidMount() {
    // We need to attach these events to the window because the user
    // might move/release the mouse outside our image.
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('mousemove', this._onMouseMove);
  },

  componentWillUnmount() {
    // Clean up the event listeners.
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('mousemove', this._onMouseMove);
  },

  render() {
    return (
      <div onMouseDown={this._onMouseDown}>
        {this.props.children}
      </div>
    );
  },

  _onMouseDown(event) {
    this.setState({
      isDragging: true,
      origX: event.pageX,
      origY: event.pageY,
    });
    event.preventDefault();
  },

  _onMouseMove(event) {
    if (this.state.isDragging) {
      this.props.onDrag(
        event.pageX - this.state.origX,
        event.pageY - this.state.origY
      );
      this.setState({
        origX: event.pageX,
        origY: event.pageY,
      });
    }
  },

  _onMouseUp() {
    if (this.state.isDragging) {
      this.setState(this.getInitialState());
    }
  },

});

module.exports = Draggable;
