import cherrypy
from external.youtube import api
from util import response
from util.response import allow_cors


def process_items(response):
  response['items'] = tuple(video.dict() for video in response['items'])
  return response


@allow_cors()
@response.json()
def search(query, page_token=None, **kwargs):
  return process_items(
    api.searchWithDetails(query, page_token)
  )

@allow_cors()
@response.json()
def related(video_id, page_token=None, **kwargs):
  return process_items(
    api.related(video_id, page_token)
  )

@allow_cors()
@response.json()
def popular(page_token=None, **kwargs):
  return process_items(
    api.popular(page_token)
  )

@allow_cors()
@response.json()
def one(video_id, **kwargs):
  return api.one_video(video_id).dict()

@allow_cors()
@response.json(jsonify=False)
def autocomplete(query, **kwargs):
  cherrypy.response.headers['Content-Type'] = 'application/javascript'
  return api.autocomplete(query, **kwargs)


routes = (
  ('youtube.search', '/api/search/{query}/', search),
  ('youtube.search_page', '/api/search/{query}/page/{page_token}/', search),

  ('youtube.related', '/api/related/{video_id}/', related),
  ('youtube.related_page', '/api/related/{video_id}/page/{page_token}/', related),

  ('youtube.popular', '/api/popular/', popular),
  ('youtube.popular_page', '/api/popular/page/{page_token}/', popular),

  ('youtube.autocomplete', '/api/autocomplete/{query}/', autocomplete),
  ('youtube.one', '/api/{video_id}/', one),
)
