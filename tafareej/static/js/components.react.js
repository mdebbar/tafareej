/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.MultiColumn = React.createClass({
    displayName: 'MultiColumn',
    render: function() {
      return this.transferPropsTo(<div className="row">{this.props.children}</div>);
    }
  });

  global.Column = React.createClass({
    displayName: 'Column',
    propType: {
      size: PropTypes.number.isRequired,
      push: PropTypes.number,
      pull: PropTypes.number
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
        <div className={classes.join(' ')}>{this.props.children}</div>
      );
    }
  });

  global.Spinner = React.createClass({
    displayName: 'Spinner',
    propTypes: {
      shown: PropTypes.bool
    },
    getDefaultProps: function() {
      return {
        shown: true
      };
    },
    render: function() {
      var classes = 'spinner';
      if (!this.props.shown) {
        classes += ' nodisplay';
      }
      // transferPropsTo() is required in case we pass ID or style.
      return this.transferPropsTo(<div className={classes}></div>);
    }
  });

})(this);
