import re
from operator import itemgetter
from external import Sources

def transform(video):
  return {
    'id'    : video['id'],
    'source': Sources.YOUTUBE,
    'uri'   : '/%s/%s/' % ('yt', video['id']),
    'title' : video['snippet']['title'],
    'desc'  : video['snippet']['description'],
    'duration': _parse_duration(video['contentDetails']['duration']),
    # a list of the main picture in different sizes
    'pictures': get_pictures(video),
    # a list of frames generated from different points at the video
    'frames': get_frames(video),
    'stats' : {
      'views'   : video['statistics']['viewCount'],
      'likes'   : video['statistics']['likeCount'],
      'dislikes': video['statistics']['dislikeCount'],
      'comments': video['statistics']['commentCount'],
      'favorites': video['statistics']['favoriteCount'],
    }
  }


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

def get_pictures(video):
  pictures = video['snippet']['thumbnails']
  return sorted(pictures.values(), key=itemgetter('width'))

MAX_IMG_NUM = 3
IMAGE_PATTERN = 'http://img.youtube.com/vi/%(id)s/%(num)s.jpg'
def genImage(video_id, img_num):
  return IMAGE_PATTERN % {'id': video_id, 'num': img_num}

def get_frames(video):
  pictures = video['snippet']['thumbnails']
  default_pic = pictures['default']['url']
  return [default_pic] + [genImage(video['id'], ii) for ii in range(1, MAX_IMG_NUM + 1)]
