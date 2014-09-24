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

  global.PinterestItem = React.createClass({
    displayName: 'PinterestItem',
    propTypes: {
      columnSpan: PropTypes.number
    },
    getDefaultProps: function() {
      return {
        columnSpan: 1
      }
    },
    render: function() {
      return React.addons.cloneWithProps(
        React.Children.only(this.props.children),
        {
          className: 'pinterest-item',
          'data-column-span': this.props.columnSpan
        }
      );
    }
  });

  global.Pinterest = React.createClass({
    displayName: 'Pinterest',
    propTypes: {
      columnWidth: PropTypes.number.isRequired,
      columnMargin: PropTypes.number.isRequired,
      animate: PropTypes.bool
    },
    getDefaultProps: function() {
      return {
        animate: true
      }
    },
    componentDidMount: function() {
      this._positionItemsDebounced = debounce(this._positionItems, 1000);
      window.addEventListener('resize', this._positionItemsDebounced);
    },
    componentDidUpdate: function() {
      this._positionItems();
    },
    componentWillUnmount: function() {
      window.removeEventListener('resize', this._positionItemsDebounced);
    },
    render: function() {
      var classes = [this.props.className, 'pinterest-container'];
      if (this.props.animate) {
        classes.push('pinterest-animate');
      }
      return (
        <div className={classes.join(' ')}>
          {this.props.children}
        </div>
      );
    },
    _getColumnCount: function() {
      var totalWidth = this.getDOMNode().offsetWidth;
      var columnWidth = this._getActualColumnWidth();
      return Math.floor(totalWidth / columnWidth);
    },
    _getOffsetForCentering: function() {
      var count = this._getColumnCount();
      var occupiedWidth = count * this._getActualColumnWidth();
      var totalWidth = this.getDOMNode().offsetWidth;
      return Math.floor((totalWidth - occupiedWidth) /  2);
    },
    _getActualColumnWidth: function() {
      return this.props.columnWidth + this.props.columnMargin;
    },
    _positionItems: function() {
      var columns = [];
      var count = this._getColumnCount();
      for (var i = 0; i < count; i++) {
        columns.push(0);
      }

      var columnWidth = this._getActualColumnWidth();
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
    _getShortestColumn: function(columns, min, max) {
      min = min || 0;
      max = max || columns.length;
      var shortest = min;
      for (var i = min + 1; i < max + 1; i++) {
        if (columns[i] < columns[shortest]) shortest = i;
      }
      return shortest;
    },
    _positionItem: function(node, colSpan, leftOffset, columns, pickedColumn) {
      var top = Math.max.apply(Math, columns.slice(pickedColumn, pickedColumn + colSpan));
      CSS.setStyle(node, {
        left: (leftOffset + pickedColumn * this._getActualColumnWidth()) + 'px',
        top: top + 'px'
      });
      var newHeight = top + node.offsetHeight + this.props.columnMargin;
      for (var i = pickedColumn; i < pickedColumn + colSpan; i++) {
        columns[i] = newHeight;
      }
    }
  });

})(this);
