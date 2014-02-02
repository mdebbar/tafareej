import re
from django.core.urlresolvers import reverse
from tafareej.content import DataObject, AbstractContent
from tafareej.maps import iter_for_key, xget, merge

DURATION_SPLIT = re.compile('(\d+)')
UNITS = ['H', 'M', 'S']

def _find_unit(str, unit):
  search = re.search('(\d+)%s' % unit, str)
  if search:
    return search.group(1)
  return None

def _parse_duration(duration_str):
  if not duration_str:
    return duration_str

  found_one = False
  parts = []
  for unit in UNITS:
    amount = _find_unit(duration_str, unit)
    if amount:
      found_one = True
      parts.append(amount)
    elif found_one:
      parts.append('0')

  # if there are no minutes, add 0 minutes
  if len(parts) == 1:
    parts.insert(0, '0')
  # fill zeroes for all parts except the first one
  parts[1:] = [p.zfill(2) for p in parts[1:]]
  return ':'.join(parts)

class SearchResult(AbstractContent):

  def get_type(self):
    return 'youtube'

  def get_url(self):
    return reverse('youtube.views.view', args=(self.get_id(),))

  def get_id(self):
    return xget(self, 'id.videoId')

  def get_title(self):
    return xget(self, 'snippet.title')

  def get_excerpt(self):
    return xget(self, 'snippet.description')

  def get_thumbnails(self):
    return DataObject(iter_for_key(xget(self, 'snippet.thumbnails'), 'url'))

  def get_thumbnail(self):
    thumbnails = xget(self, 'snippet.thumbnails')
    try:
      return xget(thumbnails, 'default', 'medium', 'high')['url']
    except (KeyError, TypeError):
      return None


class Video(SearchResult):

  def dict(self):
    return merge(super(Video, self).dict(), {'duration': self.get_duration()})

  def get_snippet_template(self):
    return 'youtube/snippet.html'

  def get_id(self):
    return xget(self, 'id')

  def get_duration(self):
    return _parse_duration(xget(self, 'contentDetails.duration'))

  def get_view_count(self):
    return xget(self, 'statistics.viewCount')

  def get_like_count(self):
    return xget(self, 'statistics.likeCount')

  def get_dislike_count(self):
    return xget(self, 'statistics.dislikeCount')

  def get_comment_count(self):
    return xget(self, 'statistics.commentCount')

  def get_favorite_count(self):
    return xget(self, 'statistics.favoriteCount')



def test():
  r = SearchResult({
    "snippet": {
      "thumbnails": {
        "default": {"url": "https://i.ytimg.com/vi/VoPPMktXCEI/default.jpg"},
        "high": {"url": "https://i.ytimg.com/vi/VoPPMktXCEI/hqdefault.jpg"},
        "medium": {"url": "https://i.ytimg.com/vi/VoPPMktXCEI/mqdefault.jpg"}
      },
      "title": "Tinariwen - \"Iswegh Attay\"",
      "channelId": "UC4xWOwA9yoRanf8fDsNT_YA",
      "publishedAt": "2012-01-06T22:31:52.000Z",
      "liveBroadcastContent": "none",
      "channelTitle": "antirecords",
      "description": "2012 WMG \"Iswegh Attay\" by Tinariwen from their Grammy nominated album 'Tassili,' available now! Get it at http://www.anti.com/store Anti Records Official ..."
    },
    "kind": "youtube#searchResult",
    "etag": "\"qQvmwbutd8GSt4eS4lhnzoWBZs0/D8Fc8W7nGxouIyS0hwVg25fm3Ao\"",
    "id": {
      "kind": "youtube#video",
      "videoId": "VoPPMktXCEI"
    }
  })
  print r.get_id()
  print r.get_title()
  thumbnails = r.get_thumbnails()
  print thumbnails
  print dict(thumbnails)
