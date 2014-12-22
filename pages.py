from cherrypy import NotFound, request
from external.youtube import api
from util import response
from util.dict import merge

DEFAULT_SETTINGS = {
  'site_name': 'Tafareej',
  'ga_code': 'UA-57910971-1',
}


@response.template('home.html', jschunks=['vendor', 'HomePage'])
def home_page(**kwargs):
  return merge(DEFAULT_SETTINGS, {
    'url': request.base,
  })

@response.template('video.html', jschunks=['vendor', 'VideoPage'])
def video_page(video_id, autoplay=True, **kwargs):
  video = api.one_video(video_id)

  if not video:
    raise NotFound

  return merge(DEFAULT_SETTINGS, {
    'url': "%s%s" % (request.base, video.get_url()),
    'video': video,
    'autoplay': autoplay not in ['0', 'false', 'no', 'off']
  })


routes = (
  ('home.view', '/', home_page),
  ('video.view', '/{video_id}', video_page),
  ('video.view', '/{video_id}/', video_page),
)
