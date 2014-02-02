{% load staticfiles %}

$(function() {
  var searchURL = '{% url "youtube.views.search" ":query:" %}';
  var relatedURL = '{% url "youtube.views.related" ":video_id:" %}';

  var searchBox = document.getElementById('{{ input_id }}');

  var resultListID = '#{{ list_id }}';
  var $resultList = $(resultListID);

  function grabContent(url) {
    $resultList.html($('<img>', {
      'class': 'search-spinner',
      'src': '{% static "img/spinner.gif" %}'
    }));
    $resultList.load(url);
  }
  var debouncedGrabContent = debounce(grabContent, 700);

  var prevValue = searchBox.value;
  function checkForChanges() {
    if (searchBox.value !== prevValue) {
      prevValue = searchBox.value;
      if (searchBox.value) {
        debouncedGrabContent(
          searchURL.replace(':query:', encodeURIComponent(searchBox.value))
        );
      } else {
        debouncedGrabContent(
          relatedURL.replace(':video_id:', encodeURIComponent(Store.get('video').id))
        );
      }
    }
  }
  setInterval(checkForChanges, 300);

  Event.listen('youtube.show_related', function(_, videoID) {
    debouncedGrabContent.cancel();
    grabContent(relatedURL.replace(':video_id:', encodeURIComponent(videoID)));
    searchBox.value = prevValue = '';
  });
});
