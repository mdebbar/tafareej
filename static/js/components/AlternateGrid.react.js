// CSS
require('../../css/alternate-grid.css');

var CSS = require('../util/CSS');
var React = require('react/addons');
var RowOrganizer = require('../util/RowOrganizer');

var debounce = require('../util/debounce');


var AlternateGrid = React.createClass({
  propTypes: {
    itemWidth: React.PropTypes.number.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    animate: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      animate: true,
    }
  },

  componentDidMount() {
    this.organizer = new RowOrganizer({
      itemWidth: this.props.itemWidth,
      itemHeight: this.props.itemHeight,
      isFocused: (item) => item.props.active,
      forEach: React.Children.forEach.bind(React.Children),
    });

    this.forceUpdateDebounced = debounce(() => this.forceUpdate(), 1000);
    window.addEventListener('resize', this.forceUpdateDebounced);

    // We need to re-render after the component is mounted
    setTimeout(() => this.forceUpdate());
  },

  componentWillReceiveProps(nextProps) {
    //TODO: Maybe update or create a new RowOrganizer if some props are different?
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.forceUpdateDebounced);
    delete this.forceUpdateDebounced;
  },

  render() {
    var classes = CSS.join(
      this.props.className,
      'alternate-grid-wrapper',
      this.props.animate ? 'alternate-grid-animate' : null
    );

    // First render
    if (!this.isMounted()) {
      return <div className={classes}>{this.props.children}</div>;
    }

    var rows = this.organizer.createRows(this.props.children, this.getDOMNode().offsetWidth);

    return (
      <div className={classes}>
        <div className="alternate-grid">
          {rows.map(this.renderRow)}
        </div>
      </div>
    );
  },

  renderRow(items, index) {
    return (
      <div key={'row_' + index} className="alternate-grid-row">
        {items.map(this.renderItem)}
      </div>
    );
  },

  renderItem(item, index) {
    return React.addons.cloneWithProps(item.element, {
      key: item.element.props['data-video-id'],
      className: 'alternate-grid-item',
      style: item.style,
    });
  },
});

AlternateGrid.Item = React.createClass({
  propTypes: {
    active: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      active: false,
    };
  },

  render() {
    var {active, className, ...other} = this.props;
    return (
      <div {...other} className={CSS.join(className, "alternate-grid-item")}>
        {this.props.children}
      </div>
    );
    return React.Children.only(this.props.children);
  },
});

module.exports = AlternateGrid;
