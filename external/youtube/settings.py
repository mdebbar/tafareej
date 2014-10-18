GOOGLE_API_KEY = 'AIzaSyBDhbq80CkRXdbP3wvT17su77zo-gzeKRM'

MAX_RESULTS = 15

DEFAULT_OPTIONS = {
  'search': {
    'part': 'id',
    'maxResults': MAX_RESULTS,
    'order': 'relevance',
    'safeSearch': 'moderate',
    'type': 'video',
    'videoEmbeddable': 'true',
  },
  'details': {
    'part': 'id,snippet,contentDetails,statistics',
  },
  'related': {
    'part': 'id,snippet',
    'maxResults': MAX_RESULTS,
    'order': 'relevance',
    'safeSearch': 'moderate',
    'type': 'video',
    'videoEmbeddable': 'true',
  },
  'popular': {
    'chart': 'mostPopular',
    'part': 'id,snippet,contentDetails,statistics',
    'maxResults': MAX_RESULTS,
  },
  'autocomplete': {
    'client': 'youtube',
    'hl': 'en',
  }
}
