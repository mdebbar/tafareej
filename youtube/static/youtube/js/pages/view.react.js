/** @jsx React.DOM */

(function(global) {
  var PropTypes = React.PropTypes;

  global.ViewPage = React.createClass({
    displayName: 'ViewPage',
    render: function() {
      var video = Store.get('video');
      return (
        <MultiColumn>
          <Column size={7}>
            <YoutubePlayerContainer autoplay={false} />
          </Column>
          <Column className="right-side" size={5}>
            <SearchableSnippetList />
          </Column>
        </MultiColumn>
      );
    }
  });

})(this);
