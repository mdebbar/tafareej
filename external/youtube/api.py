from apiclient.discovery import build

from external.retry import retry
from util.dict import merge
from settings import DEFAULT_OPTIONS, GOOGLE_API_KEY
from transformer import transform

youtube = build('youtube', 'v3', developerKey=GOOGLE_API_KEY)

def merge_defaults(key, options):
  return merge(DEFAULT_OPTIONS[key], options)


def search(query, page_token=None, **options):
  if page_token is not None:
    options['pageToken'] = page_token
  return get_result_details(search_call(query, **options))

def get_result_details(results):
  response = details_call(result['id']['videoId'] for result in results['items'])
  if 'nextPageToken' in results:
    response['nextPageToken'] = results['nextPageToken']
  if 'prevPageToken' in results:
    response['prevPageToken'] = results['prevPageToken']
  if 'pageInfo' in results:
    response['pageInfo'] = results['pageInfo']
  return response

@retry
def search_call(query, **options):
  search_options = merge_defaults('search', options)
  if query:
    search_options['q'] = unicode(query)
  return youtube.search().list(**search_options).execute()

@retry
def details_call(id_list, **options):
  joined_ids = ','.join(id_list)
  videos_options = merge_defaults('details', options)
  response = youtube.videos().list(id=joined_ids, **videos_options).execute()
  response['items'] = [transform(video) for video in response.get('items', [])]
  return response

@retry
def popular(page_token=None, **options):
  if page_token is not None:
    options['pageToken'] = page_token
  videos_options = merge_defaults('popular', options)
  response = youtube.videos().list(**videos_options).execute()
  response['items'] = [transform(video) for video in response.get('items', [])]
  return response

def one_video(id, **options):
  try:
    return details_call([id], **options)['items'][0]
  except IndexError:
    return None

def related(video_id, page_token=None, **options):
  if page_token is not None:
    options['pageToken'] = page_token
  return search(None, relatedToVideoId=video_id, **options)
