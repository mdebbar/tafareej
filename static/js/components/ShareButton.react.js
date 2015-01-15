var CSS = require('../util/CSS');
var Immutable = require('immutable');
var React = require('react');
var SiteInfo = require('../SiteInfo');

function getAbsoluteURL(path) {
  return `${SiteInfo.domain}${path}`;
}

function getFBShareURL(url, countLayout) {
  return `//www.facebook.com/plugins/share_button.php?href=${url}&layout=${countLayout}`;
}

function getTwitterShareURL(url, countLayout) {
  return `//platform.twitter.com/widgets/tweet_button.html?url=${url}&count=${countLayout}`;
}

// function getGoogleShareURL(url, countLayout) {
//   return `//plusone.google.com/_/+1/fastbutton?bsv&size=medium&hl=en-US&url=${url}&embed=true`;
// }

var urlByTarget = {
  fb: getFBShareURL,
  twitter: getTwitterShareURL,
  // google: getGoogleShareURL,
};

var layoutByTarget = {
  fb: {
    none: 'button',
    vertical: 'box_count',
    horizontal: 'button_count',
  },
  twitter: {
    none: 'none',
    vertical: 'vertical',
    horizontal: 'horizontal',
  },
  // google: {
  //   none: null,
  //   vertical: 'vertical-bubble',
  //   horizontal: 'bubble',
  // },
};

var ShareButton = React.createClass({
  propTypes: {
    target: React.PropTypes.oneOf(Object.keys(urlByTarget)).isRequired,
    countLayout: React.PropTypes.oneOf(Object.keys(layoutByTarget['fb'])).isRequired,
    video: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },

  getDefaultProps() {
    return {
      countLayout: 'none',
    };
  },

  render() {
    var {video, target, countLayout, className, ...other} = this.props;
    var url = window.encodeURIComponent(getAbsoluteURL(video.get('uri')));

    var getShareURL = urlByTarget[target];
    var countLayout = layoutByTarget[target][countLayout];
    return (
      <div {...other} className={CSS.join(className, 'social-button')}>
        <iframe
          src={getShareURL(url, countLayout)}
          scrolling="no"
          frameborder="0"
          style={{border:'none', overflow:'hidden'}}
          allowTransparency="true"
        />
      </div>
    );
  },
});

module.exports = ShareButton;
