// CSS
require('../../css/social.css');

var CSS = require('../util/CSS');
var Immutable = require('immutable');
var React = require('react');
var ShareButton = require('./ShareButton.react');

var SocialBar = React.createClass({
  propTypes: {
    targets: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    countLayout: React.PropTypes.string,
    video: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },

  render() {
    var {video, targets, countLayout, ...other} = this.props;

    var buttons = targets.map(
      (target) => <ShareButton target={target} countLayout={countLayout} video={video} />
    );

    return (
      <div {...other}>
        {buttons}
      </div>
    );
  },
});

module.exports = SocialBar;
