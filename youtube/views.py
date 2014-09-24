from django.conf import settings
from django.http.response import Http404, HttpResponse
from django.shortcuts import render_to_response
from tafareej import JsonResponse
from youtube import api


def api_search(req, query, page_token=None):
  response = api.searchWithDetails(query, page_token)
  response['items'] = tuple(video.dict() for video in response['items'])
  return JsonResponse(response)

def api_related(req, video_id, page_token=None):
  response = api.related(video_id, page_token)
  response['items'] = tuple(video.dict() for video in response['items'])
  return JsonResponse(response)

def api_popular(req, page_token=None):
  response = api.popular(page_token)
  response['items'] = tuple(video.dict() for video in response['items'])
  return JsonResponse(response)

def api_one(req, video_id):
  return JsonResponse(api.one_video(video_id).dict())

def api_autocomplete(req, query):
  return HttpResponse(api.autocomplete(query, **req.GET.dict()), content_type='text/javascript')

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
