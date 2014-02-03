/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  var VideoStore = StoreFactory.create('VideoStore');
  VideoStore.set('video-map', {});
  VideoStore.set('video', StoreFactory.get('GlobalStore').get('video'));

  global.ViewPage = React.createClass({
    displayName: 'ViewPage',
    render: function() {
      var video = Store.get('video');
      return (
        <MultiColumn>
          <Column size={7}>
            <YoutubePlayerContainer videoStore={VideoStore} />
          </Column>
          <Column className="right-side" size={5}>
            <SearchableSnippetList
              onResults={this._onResults}
              onSnippetClick={this._onSnippetClick}
            />
          </Column>
        </MultiColumn>
      );
    },
    _onSnippetClick: function(video) {
      VideoStore.set('video', video);
    },
    _onResults: function(videos) {
      var videoMap = {};
      videos.forEach(function(video) {
        videoMap[video.id] = video;
      });
      VideoStore.update('video-map', videoMap);
    }
  });

})(this);
