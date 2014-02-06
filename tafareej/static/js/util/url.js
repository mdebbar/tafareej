(function(global) {

  const QUERY = '__query__';
  const PAGE_TOKEN = '__page_token__';
  const VIDEO_ID = '__video_id__';

  // API URLs
  const API_SEARCH_URL  = '/api/search/' + QUERY + '/';
  const API_SEARCH_PAGE_URL  = '/api/search/' + QUERY + '/page/' + PAGE_TOKEN + '/';
  const API_RELATED_URL = '/api/related/' + VIDEO_ID + '/';
  const API_VIDEO_URL   = '/api/' + VIDEO_ID + '/';

  // other URLs
  const VIDEO_URL = '/' + VIDEO_ID + '/';

  function createReplacer(patternURL, var1, var2) {
    return function(val1, val2) {
      var replaced = patternURL.replace(var1, val1);
      if (var2) {
        replaced = replaced.replace(var2, val2);
      }
      return replaced;
    };
  }

  global.URL = {
    API: {
      search: createReplacer(API_SEARCH_URL, QUERY),
      searchPage: createReplacer(API_SEARCH_PAGE_URL, QUERY, PAGE_TOKEN),
      related: createReplacer(API_RELATED_URL, VIDEO_ID),
      video: createReplacer(API_VIDEO_URL, VIDEO_ID)
    },
    video: createReplacer(VIDEO_URL, VIDEO_ID)
  };

})(this);
