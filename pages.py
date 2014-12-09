from cherrypy import NotFound
from external.youtube import api
from util import response


@response.template('home.html', jschunks=['vendor', 'HomePage'])
def home_page(**kwargs):
  return {
    'sitename': 'Tafareej',
  }

@response.template('video.html', jschunks=['vendor', 'ViewPage'])
def video_page(video_id, autoplay=True, **kwargs):
  video = api.one_video(video_id)

  if not video:
    raise NotFound

  return {
    'video': video,
    'autoplay': autoplay not in ['0', 'false', 'no', 'off']
  }


routes = (
  ('home.view', '/', home_page),
  ('video.view', '/{video_id}/', video_page),
)
