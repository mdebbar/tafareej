function loadYoutubeAPI() {
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// This will be called by Youtube API when the player is ready.
function onYouTubeIframeAPIReady() {
  // used to load a video's details when the user clicks it from in-player suggestions
  const youtubeVideoURL = '{% url 'view_video' '__id__' %}';

  var ytplayer = new YT.Player('{{ player_id }}', {
    height: '390',
    width: '640',
    videoId: Store.get('video').id,
    playerVars: {
      autoplay: 1,
      theme: 'light'
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
  setupNavigationHistory(ytplayer);
  setupPartialRepetition(ytplayer);

  var autoreplay = false;
  Event.listen('youtube.autoreplay', function(_, enabled) {
    autoreplay = enabled;
  });

  var ended = false;
  var switching = false;
  function onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.UNSTARTED:
        !switching && ended && videoSwitchedFromPlayer(event.target);
        ended = false;
        switching = false;
        break;
      case YT.PlayerState.ENDED:
        autoreplay && event.target.playVideo();
        ended = true;
        break;
    }
  }

  function setupNavigationHistory(player) {
    var video = Store.get('video');
    history.replaceState(video, video.title);

    Event.listen('youtube.show', function(_, data) {
      switching = true;
      switchToVideo(player, data.video, data.play);
      history.pushState(data.video, data.video.title, data.video.url);
    });

    window.onpopstate = function(event) {
      event.state && switchToVideo(player, event.state);
    };
  }

  const DOT = 46;
  function setupPartialRepetition(player) {
    var start;
    var end;
    var repetition;
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === DOT) {
        if (start == null) {
          start = player.getCurrentTime();
        } else if (end == null) {
          end = player.getCurrentTime();
          if (start < end) {
            repetition = startPartialRepetition(player, start, end);
          } else {
            start = end = null;
          }
        } else {
          repetition.cancel();
        }
      }
    })
  }

  function startPartialRepetition(player, start, end) {
    console.log('Partial repetition enabled: [' + start, '-', end + ']');
    player.seekTo(start);
    var timer = setInterval(function() {
      if (player.getCurrentTime() > end) {
        player.seekTo(start);
      }
    }, 30);
    return {
      cancel: function() {
        clearInterval(timer);
        console.log('Cancelled partial repetition');
      }
    };
  }

  function videoSwitchedFromPlayer(player) {
    var videoID = player.getVideoData().video_id;
    var url = youtubeVideoURL.replace('__id__', videoID);
    history.pushState({id: videoID}, null, url);
    updateTitle('');
    $.getJSON(url, {json: 1}, function(video) {
      Event.fire('youtube.show_related', videoID);
      switchToVideo(player, video, false);
      history.replaceState(video, video.title, video.url);
    });
  }

  var titleSelector = '#{{ title_id }}';
  function updateTitle(title) {
    $(titleSelector).text(title);
    document.title = title;
  }

  function switchToVideo(player, video, play) {
    if (typeof play === 'undefined' || play) {
      player.loadVideoById(video.id, 0, 'medium');
    }
    updateTitle(video.title);
    Store.set('video', video);
  }
}

$(loadYoutubeAPI);
