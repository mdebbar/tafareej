// CSS
require('../../css/pinterest.css');

var debounce = require('../util/debounce');
var CSS = require('../util/CSS');
var React = require('React');

var PinterestItem = React.createClass({
  propTypes: {
    columnSpan: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      columnSpan: 1,
    }
  },

  render() {
    var child = React.Children.only(this.props.children);
    child.props.className = CSS.join(child.props.className, 'pinterest-item');
    child.props['data-column-span'] = this.props.columnSpan;
    return child;
  }
});

var Pinterest = React.createClass({
  propTypes: {
    columnWidth: React.PropTypes.number.isRequired,
    columnMargin: React.PropTypes.number.isRequired,
    animate: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      animate: true,
    }
  },

  componentDidMount() {
    this._positionItemsDebounced = debounce(this._positionItems, 1000);
    window.addEventListener('resize', this._positionItemsDebounced);
  },

  componentDidUpdate() {
    this._positionItems();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._positionItemsDebounced);
  },

  render() {
    var classes = CSS.join(
      this.props.className,
      'pinterest-container',
      {'pinterest-animate': this.props.animate}
    );
    return (
      <div className={classes}>
          {this.props.children}
      </div>
      );
  },

  _getColumnCount() {
    var totalWidth = this.getDOMNode().offsetWidth;
    var columnWidth = this._getActualColumnWidth();
    return Math.floor(totalWidth / columnWidth);
  },

  _getOffsetForCentering() {
    var count = this._getColumnCount();
    var occupiedWidth = count * this._getActualColumnWidth();
    var totalWidth = this.getDOMNode().offsetWidth;
    return Math.floor((totalWidth - occupiedWidth) /  2);
  },

  _getActualColumnWidth() {
    return this.props.columnWidth + this.props.columnMargin;
  },

  _positionItems() {
    var columns = [];
    var count = this._getColumnCount();
    for (var i = 0; i < count; i++) {
      columns.push(0);
    }

    var leftOffset = this._getOffsetForCentering();
    var childNodes = this.getDOMNode().childNodes;
    for (i = 0; i < childNodes.length; i++) {
      var node = childNodes[i];
      if (!CSS.hasClass(node, 'pinterest-item')) {
        continue;
      }
      var colSpan = parseInt(node.getAttribute('data-column-span') || 1, 10);
      var shortestColumn = this._getShortestColumn(columns, 0, columns.length - colSpan);
      this._positionItem(node, colSpan, leftOffset, columns, shortestColumn);
    }
  },

  _getShortestColumn(columns, min, max) {
    min = min || 0;
    max = max || columns.length;
    var shortest = min;
    for (var i = min + 1; i < max + 1; i++) {
      if (columns[i] < columns[shortest]) shortest = i;
    }
    return shortest;
  },

  _positionItem(node, colSpan, leftOffset, columns, pickedColumn) {
    var top = Math.max.apply(Math, columns.slice(pickedColumn, pickedColumn + colSpan));
    CSS.setStyle(node, {
      left: (leftOffset + pickedColumn * this._getActualColumnWidth()) + 'px',
      top: top + 'px',
      opacity: 1,
    });
    var newHeight = top + node.offsetHeight + this.props.columnMargin;
    for (var i = pickedColumn; i < pickedColumn + colSpan; i++) {
      columns[i] = newHeight;
    }
  }
});

Pinterest.Item = PinterestItem;

module.exports = Pinterest;
