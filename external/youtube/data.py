import json
import re

import urls
from util.dict import iter_for_key, xget, merge, FrozenDict

DURATION_SPLIT = re.compile('(\d+)')
UNITS = ['H', 'M', 'S']

MAX_IMG_NUM = 3
IMAGE_PATTERN = 'http://img.youtube.com/vi/%(id)s/%(num)s.jpg'
def genImage(video_id, img_num):
  return IMAGE_PATTERN % {'id': video_id, 'num': img_num}

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


class DataObject(FrozenDict):

  def __getattr__(self, name):
    try:
      val = self[name]
      if isinstance(val, dict):
        return DataObject(val)
      else:
        return val
    except KeyError, e:
      raise AttributeError(e)

  def __repr__(self):
    return '<DataObject %s>' % super(FrozenDict, self).__repr__()


class SearchResult(DataObject):
  def dict(self):
    return {
      'id': self.get_id(),
      'title': self.get_title(),
      'url': self.get_url(),
      'excerpt': self.get_excerpt(),
      'thumbnail': self.get_thumbnail(),
      'thumbnails': self.get_thumbnail_versions(),
      'images': self.get_images(),
    }

  def jsonify(self):
    return json.dumps(self.dict())

  def get_url(self):
    return urls.getVideoURL(self.get_id())

  def get_id(self):
    return xget(self, 'id.videoId')

  def get_title(self):
    return xget(self, 'snippet.title')

  def get_excerpt(self):
    return xget(self, 'snippet.description')

  def get_thumbnail_versions(self):
    return DataObject(iter_for_key(xget(self, 'snippet.thumbnails'), 'url'))

  def get_thumbnail(self):
    thumbnails = xget(self, 'snippet.thumbnails')
    try:
      return xget(thumbnails, 'default', 'medium', 'high')['url']
    except (KeyError, TypeError):
      return None

  def get_large_image(self):
    thumbnails = xget(self, 'snippet.thumbnails')
    try:
      return xget(thumbnails, 'maxres', 'standard', 'high', 'medium', 'default')['url']
    except (KeyError, TypeError):
      return None

  def get_images(self):
    id = self.get_id()
    return [self.get_thumbnail()] + [genImage(id, ii) for ii in range(1, MAX_IMG_NUM + 1)]


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

