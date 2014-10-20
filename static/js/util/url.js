(function(global) {

  var DOMAIN = '';

  // TODO: find a better way to build these URLs (maybe pass them from python .reverse() )

  const QUERY = '__query__';
  const PAGE_TOKEN = '__page_token__';
  const VIDEO_ID = '__video_id__';
  const PLAYER_API_ID = '__player_id__';

  // API URLs
  const API_SEARCH_URL  = '/api/search/' + QUERY + '/';
  const API_SEARCH_PAGE_URL  = '/api/search/' + QUERY + '/page/' + PAGE_TOKEN + '/';
  const API_RELATED_URL = '/api/related/' + VIDEO_ID + '/';
  const API_RELATED_PAGE_URL = '/api/related/' + VIDEO_ID + '/page/' + PAGE_TOKEN + '/';
  const API_POPULAR_URL = '/api/popular/';
  const API_POPULAR_PAGE_URL = '/api/popular/page/' + PAGE_TOKEN + '/';
  const API_VIDEO_URL   = '/api/' + VIDEO_ID + '/';
  const API_AUTOCOMPLETE = '/api/autocomplete/' + QUERY + '/';

  // other URLs
  const VIDEO_URL = '/' + VIDEO_ID + '/';
  const YOUTUBE_PLAYER_URL = 'https://www.youtube.com/player_api?playerapiid=' + PLAYER_API_ID;

  function createReplacer(patternURL, var1, var2) {
    return function(val1, val2) {
      var replaced = patternURL;
      if (var1) {
        replaced = replaced.replace(var1, val1);
        if (var2) {
          replaced = replaced.replace(var2, val2);
        }
      }
      return DOMAIN + replaced;
    };
  }

  global.URL = {
    setDomain: function(domain) {
      // Remove trailing slash
      if (domain[domain.length - 1] === '/') {
        domain = domain.substr(0, domain.length - 1);
      }
      DOMAIN = domain;
    },
    API: {
      search: createReplacer(API_SEARCH_URL, QUERY),
      searchPage: createReplacer(API_SEARCH_PAGE_URL, QUERY, PAGE_TOKEN),
      related: createReplacer(API_RELATED_URL, VIDEO_ID),
      relatedPage: createReplacer(API_RELATED_PAGE_URL, VIDEO_ID, PAGE_TOKEN),
      popular: createReplacer(API_POPULAR_URL),
      popularPage: createReplacer(API_POPULAR_PAGE_URL, PAGE_TOKEN),
      video: createReplacer(API_VIDEO_URL, VIDEO_ID),
      autocomplete: createReplacer(API_AUTOCOMPLETE, QUERY)
    },
    video: createReplacer(VIDEO_URL, VIDEO_ID),
    youtubePlayer: createReplacer(YOUTUBE_PLAYER_URL, PLAYER_API_ID)
  };

})(MODULES);
