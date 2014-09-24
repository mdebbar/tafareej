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

  global.InfiniteScroll = React.createClass({
    displayName: 'InfiniteScroll',
    propTypes: {
      buffer: PropTypes.number,
      throttle: PropTypes.number,
      onTrigger: PropTypes.func.isRequired
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

  // TODO: use SmartLink in SnippetList
  global.SmartLink = React.createClass({
    displayName: 'SmartLink',
    propTypes: {
      href: PropTypes.string.isRequired,
      onClick: PropTypes.func
    },
    render: function() {
      return this.transferPropsTo(
        <a href={this.props.href} onClick={this._onClick}>
          {this.props.children}
        </a>
      );
    },
    _onClick: function(event) {
      // If it's a special click, let the default behavior happen.
      if (!this.props.onClick || event.ctrlKey || event.shiftKey || event.metaKey) {
        return;
      }
      event.preventDefault();
      this.props.onClick(event);
    }
  });

})(this);
