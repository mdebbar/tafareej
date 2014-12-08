from cherrypy import NotFound
from external.youtube import api
from util import response


@response.template('view_video.html', jschunks=['vendor', 'ViewPage'])
def view_video(video_id, autoplay=True, **kwargs):
  video = api.one_video(video_id)

  if not video:
    raise NotFound

  return {
    'video': video,
    'autoplay': autoplay not in ['0', 'false', 'no', 'off']
  }


routes = (
  ('video.view', '/{video_id}/', view_video),
)
