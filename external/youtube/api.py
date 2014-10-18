from apiclient.discovery import build
import requests

from external.retry import retry
from util.dict import merge, xset
from settings import DEFAULT_OPTIONS, GOOGLE_API_KEY
from data import SearchResult, Video

youtube = build('youtube', 'v3', developerKey=GOOGLE_API_KEY)

def merge_defaults(key, options):
  return merge(DEFAULT_OPTIONS[key], options)

@retry
def search(query, **options):
  search_options = merge_defaults('search', options)
  if query:
    search_options['q'] = unicode(query)
  response = youtube.search().list(**search_options).execute()
  return xset(
    response,
    'items',
    tuple(SearchResult(result) for result in response.get('items', []))
  )

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

def getDetailsForResults(results):
  response = details(video.get_id() for video in results['items'])
  if 'nextPageToken' in results:
    response['nextPageToken'] = results['nextPageToken']
  if 'prevPageToken' in results:
    response['prevPageToken'] = results['prevPageToken']
  if 'pageInfo' in results:
    response['pageInfo'] = results['pageInfo']
  return response


def searchWithDetails(query, page_token=None, **options):
  if page_token is not None:
    options['pageToken'] = page_token
  return getDetailsForResults(search(query, **options))

@retry
def popular(page_token=None, **options):
  if page_token is not None:
    options['pageToken'] = page_token
  videos_options = merge_defaults('popular', options)
  popular_videos = youtube.videos().list(**videos_options).execute()
  return xset(
    popular_videos,
    'items',
    tuple(Video(result) for result in popular_videos.get('items', []))
  )

def one_video(id, **options):
  try:
    return details([id], **options)['items'][0]
  except IndexError:
    return None

def related(video_id, page_token=None, **options):
  if page_token is not None:
    options['pageToken'] = page_token
  return searchWithDetails(None, relatedToVideoId=video_id, **options)


AUTOCOMPLETE_URL = 'http://suggestqueries.google.com/complete/search'

@retry
def autocomplete(query, **options):
  req_options = merge_defaults('autocomplete', options)
  req_options['q'] = unicode(query)
  return requests.get(AUTOCOMPLETE_URL, params=req_options).text
