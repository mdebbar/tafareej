from cherrypy import NotFound, request
from external.youtube import api
from util import response
from util.dict import merge
from external import Sources

DEFAULT_SETTINGS = {
  'site_info': {
    'name': 'Tafareej',
    'domain': 'http://tafareej.com',
  },
  'ga_code': 'UA-57910971-1',
}


@response.template('home.html', jschunks=['vendor', 'HomePage'])
def home_page(**kwargs):
  title = DEFAULT_SETTINGS['site_info']['name']
  if kwargs.get('q'):
    title = '%s - %s' % (title, kwargs['q'])

  return merge(DEFAULT_SETTINGS, {
    'page_title': title,
    'page_url': request.base,
  })

@response.template('video.html', jschunks=['vendor', 'VideoPage'])
def video_page(video_id, source=Sources.YOUTUBE, autoplay=True, **kwargs):
  video = None
  if source == Sources.YOUTUBE:
    video = api.one_video(video_id)

  if not video:
    raise NotFound

  return merge(DEFAULT_SETTINGS, {
    'page_title': video['title'],
    'page_image': video['pictures'][-1]['url'],
    'page_url' : '%s%s' % (request.base, video['uri']),
    'video' : video,
    'autoplay': autoplay not in ['0', 'false', 'no', 'off']
  })

@response.template('dsm.html', jschunks=['vendor', 'DSMPage'])
def dsm_page(**kwargs):
  return {}


routes = (
  ('home.view', '/', home_page),
  ('dsm.view', '/dsm/', dsm_page),
  ('video.view', '/{video_id}', video_page),
  ('video.view', '/{video_id}/', video_page),
  ('video.view', '/{source}/{video_id}', video_page),
  ('video.view', '/{source}/{video_id}/', video_page),

)
