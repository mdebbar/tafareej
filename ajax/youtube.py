from external.youtube import api
from util import response


@response.json()
def search(query, page_token=None, **kwargs):
  return api.search(query, page_token)

@response.json()
def related(video_id, page_token=None, **kwargs):
  return api.related(video_id, page_token)

@response.json()
def popular(page_token=None, **kwargs):
  return api.popular(page_token)

@response.json()
def one(video_id, **kwargs):
  return api.one_video(video_id)


routes = (
  ('youtube.search', '/api/search/{query}/', search),
  ('youtube.search_page', '/api/search/{query}/page/{page_token}/', search),

  ('youtube.related', '/api/related/{video_id}/', related),
  ('youtube.related_page', '/api/related/{video_id}/page/{page_token}/', related),

  ('youtube.popular', '/api/popular/', popular),
  ('youtube.popular_page', '/api/popular/page/{page_token}/', popular),

  ('youtube.one', '/api/{video_id}/', one),
)
