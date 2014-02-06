(function(global) {

  const QUERY = '__query__';
  const VIDEO_ID = '__video_id__';

  // API URLs
  const API_SEARCH_URL  = '/api/search/' + QUERY + '/';
  const API_RELATED_URL = '/api/related/' + VIDEO_ID + '/';
  const API_VIDEO_URL   = '/api/' + VIDEO_ID + '/';

  // other URLs
  const VIDEO_URL = '/' + VIDEO_ID + '/';

  function createReplacer(patternURL, variable) {
    return function(value) {
      return patternURL.replace(variable, value);
    };
  }

  global.URL = {
    API: {
      search: createReplacer(API_SEARCH_URL, QUERY),
      related: createReplacer(API_RELATED_URL, VIDEO_ID),
      video: createReplacer(API_VIDEO_URL, VIDEO_ID)
    },
    video: createReplacer(VIDEO_URL, VIDEO_ID)
  };

})(this);
