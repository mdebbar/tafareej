from apiclient.discovery import build
from tafareej.decorators import retry
from tafareej.maps import merge, xset
from youtube.settings import DEFAULT_OPTIONS, GOOGLE_API_KEY
from youtube.content import Video

youtube = build('youtube', 'v3', developerKey=GOOGLE_API_KEY)

def merge_defaults(key, options):
  return merge(DEFAULT_OPTIONS[key], options)

@retry
def details(id_list, **options):
  joined_ids = ','.join(id_list)
  videos_options = merge_defaults('details', options)
  response = youtube.videos().list(id=joined_ids, **videos_options).execute()
  return xset(
    response,
    'items',
    tuple(Video(result) for result in response.get('items', []))
  )

def one_video(id, **options):
  try:
    return details([id], **options)['items'][0]
  except IndexError:
    return None
