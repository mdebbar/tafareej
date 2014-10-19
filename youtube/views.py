from django.conf import settings
from django.http.response import Http404
from django.shortcuts import render_to_response
from youtube import api


def view(req, video_id):
  video = api.one_video(video_id)

  autoplay = req.GET.get('autoplay') not in ['0', 'false', 'no', 'off']
  try:
    return render_to_response('youtube/react/view.html', {
      'video': video,
      'autoplay': autoplay,
    })
  except IndexError:
    raise Http404()

def home(req):
  return render_to_response('youtube/react/home.html', {
    'title': settings.SITE_NAME,
  })
