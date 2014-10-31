var CSS = require('../util/CSS');
var React = require('React');

const COL_CLASS_PREFIXES = [
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
  displayName: 'MultiColumn',
  render: function() {
    return this.transferPropsTo(<div className="row">{this.props.children}</div>);
  }
});

var Column = React.createClass({
  displayName: 'Column',
  propType: {
    size: React.PropTypes.number.isRequired,
    push: React.PropTypes.number,
    pull: React.PropTypes.number
  },
  render: function() {
    var classes = [colClass(this.props.size)];
    COL_CLASS_PREFIXES.forEach(function(prefix) {
      if (this.props.push) {
        classes.push(prefix + 'push-' + String(this.props.push));
      }
      if (this.props.pull) {
        classes.push(prefix + 'pull-' + String(this.props.pull));
      }
    }, this);
    return this.transferPropsTo(
      <div className={CSS.join(classes)}>{this.props.children}</div>
    );
  }
});

module.exports = {
  colClass: colClass,
  Column: Column,
  MultiColumn: MultiColumn
};
