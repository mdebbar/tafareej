var CSS = require('../util/CSS');
var React = require('react');

var COL_CLASS_PREFIXES = [
  // 'col-xs-',
  // 'col-sm-',
  'col-md-',
  'col-lg-'
];

function colClass(size) {
  return CSS.join(
    COL_CLASS_PREFIXES.map(function(prefix) { return prefix + String(size); })
  );
}


var MultiColumn = React.createClass({
  render() {
    return (
      <div
        {...this.props}
        className={CSS.join(this.props.className, 'row')}>
        {this.props.children}
      </div>
    );
  },
});

var Column = React.createClass({
  propType: {
    size: React.PropTypes.number.isRequired,
    push: React.PropTypes.number,
    pull: React.PropTypes.number,
  },

  render() {
    var {className, size, push, pull, ...other} = this.props;
    var classes = [className, colClass(size)];
    COL_CLASS_PREFIXES.forEach(function(prefix) {
      if (push) {
        classes.push(prefix + 'push-' + String(push));
      }
      if (pull) {
        classes.push(prefix + 'pull-' + String(pull));
      }
    });

    return (
      <div {...other} className={CSS.join(classes)}>{this.props.children}</div>
    );
  },
});

module.exports = {
  colClass: colClass,
  Column: Column,
  MultiColumn: MultiColumn,
};
