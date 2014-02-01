$(function() {
  var MAX_IMAGE_NUM = 3;
  var thumbnailURL = 'http://img.youtube.com/vi/:id:/:img:.jpg';

  var snippetListID = '#{{ snippet_list_id }}';
  var $snippetList = $(snippetListID);

  $snippetList.on('click', '.snippet-youtube .snippet-link', function(event) {
    // if the user is trying to open in new tab or something else, let him.
    if (event.ctrlKey || event.shiftKey || event.metaKey) {
      return;
    }
    if (!Event.hasListeners('youtube.show')) {
      return;
    }

    event.preventDefault();
    Event.fire('youtube.show', {
      video: $(this).parent('.snippet-item').data('content')
    });
  });

  var timer;
  $snippetList.on('mouseenter', '.snippet-youtube', function() {
    clearInterval(timer);
    animateThumbnails(this);
  });
  $snippetList.on('mouseleave', '.snippet-youtube', function() {
    clearInterval(timer);
    revertThumbnail(this);
  });

  function animateThumbnails(snippet) {
    var video = JSON.parse(snippet.dataset.content);
    var currentImageNum = 0;

    var $image = $('.snippet-thumb', snippet);
    timer = setInterval(function() {
      if (++currentImageNum > MAX_IMAGE_NUM) {
        currentImageNum = 0;
        $image.attr('src', video.thumbnail);
      } else {
        $image.attr('src', thumbnailURL.replace(':id:', video.id).replace(':img:', currentImageNum));
      }
    }, 1000);
  }

  function revertThumbnail(snippet) {
    var video = JSON.parse(snippet.dataset.content);
    $('.snippet-thumb', snippet).attr('src', video.thumbnail);
  }
});
