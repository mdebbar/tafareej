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
const API_AUTOCOMPLETE = 'http://suggestqueries.google.com/complete/search?client=youtube&hl=en&q=' + QUERY;

// other URLs
const YOUTUBE_PLAYER_URL = 'https://www.youtube.com/player_api?playerapiid=' + PLAYER_API_ID;

function createReplacer(patternURL, ...vars) {
  return function(...vals) {
    return vars.reduce(
      (str, v) => str.replace(v, vals.shift()),
      patternURL
    );
  };
}

module.exports = {
  API: {
    search      : createReplacer(API_SEARCH_URL, QUERY),
    searchPage  : createReplacer(API_SEARCH_PAGE_URL, QUERY, PAGE_TOKEN),
    related     : createReplacer(API_RELATED_URL, VIDEO_ID),
    relatedPage : createReplacer(API_RELATED_PAGE_URL, VIDEO_ID, PAGE_TOKEN),
    popular     : createReplacer(API_POPULAR_URL),
    popularPage : createReplacer(API_POPULAR_PAGE_URL, PAGE_TOKEN),
    video       : createReplacer(API_VIDEO_URL, VIDEO_ID),
    autocomplete: createReplacer(API_AUTOCOMPLETE, QUERY)
  },
  youtubePlayer: createReplacer(YOUTUBE_PLAYER_URL, PLAYER_API_ID)
};
