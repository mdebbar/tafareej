/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.YoutubePlayer = React.createClass({
    propType: {

    },

    render: function() {
      return <div>Youtube Player</div>;
    }
  });

  global.SnippetImage = React.createClass({
    propTypes: {
      source: PropTypes.string,
      duration: PropTypes.string,
      forceRender: PropTypes.bool
    },

    render: function() {
      if (this.props.source) {
        return (
          <div className="snippet-image-container">
            <img className="snippet-image" src={this.props.source} />
            <div class="snippet-duration">{this.props.duration}</div>
          </div>
        );
      } else if (this.props.forceRender) {
        return <div className="snippet-image-container"></div>;
      } else {
        return <noscript />;
      }
    }
  });

  global.SnippetItem = React.createClass({
    propTypes: {
      video: PropTypes.object.isRequired
    },

    render: function() {
      var video = this.props.video;
      return (
        <a className="snippet-link" href={video.url}>
          <SnippetImage source={video.images[0]} duration={video.duration} />
          <div className="snippet-content">
            <h4 className="snippet-title">{video.title}</h4>
            <p className="snippet-excerpt">{video.excerpt}</p>
          </div>
        </a>
      );
    }
  });

  global.SnippetList = React.createClass({
    propTypes: {
      videoList: PropTypes.array.isRequired
    },

    render: function() {
      return (
        <ul className="snippet-list">
          {this.props.videoList.map(this._renderSnippetItem)}
        </ul>
      )
    },

    _renderSnippetItem: function(video) {
      return (
        <li className="snippet-item">
          <SnippetItem video={video} />
        </li>
      );
    }
  });

})(this);
