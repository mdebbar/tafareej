// CSS
require('../../css/video-header.css');

var CSS = require('../util/CSS');
var Immutable = require('immutable');
var React = require('react');
var SiteInfo = require('../SiteInfo');
var SocialBar = require('./SocialBar.react');

var VideoHeader = React.createClass({
  proptTypes: {
    video: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },

  render() {
    var {video, className, ...other} = this.props;
    return (
      <div
        {...other}
        className={CSS.join(className, 'video-header')}
        data-border="all"
        data-border-round="all">
        <a href="/" className="video-header-site-link">
          <h2 className="video-header-site-name">{SiteInfo.name}</h2>
        </a>
        <SocialBar targets={['fb', 'twitter']} video={video} />
      </div>
    );
  },
});

module.exports = VideoHeader;
