/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.ViewPage = React.createClass({
    render: function() {
      var video = Store.get('video');
      return (
        <MultiColumn>
          <Column size={7}>
            <YoutubePlayer />
          </Column>
          <Column className="right-side" size={5}>
            <SnippetList videoList={Store.get('video_list', [])} />
          </Column>
        </MultiColumn>
      );
    }
  });

})(this);
