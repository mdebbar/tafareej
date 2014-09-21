from django.http.response import Http404
from django.shortcuts import render_to_response, render
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

def api_one(req, video_id):
  return JsonResponse(api.one_video(video_id).dict())

def search(req, query):
  response = api.search(query, part='id,snippet', **req.GET.dict())

  return render(req, 'youtube/results.html', {
    'title': query,
    'query': query,
    'videos': response['items'],
  })

def details(req, query):
  videos = api.searchWithDetails(query, **req.GET)

  return render(req, 'youtube/results.html', {
    'title': query,
    'query': query,
    'videos': videos['items'],
  })

def related(req, video_id):
  related_videos = api.related(video_id, **req.GET)

  return render(req, 'youtube/results.html', {
    'title': video_id,
    'query': video_id,
    'videos': related_videos['items'],
  })

def popular(req):
  popular_videos = api.popular(**req.GET)

  return render(req, 'youtube/results.html', {
    'title': 'Popular Videos',
    'query': '',
    'videos': popular_videos['items'],
  })

def view(req, video_id):
  video = api.one_video(video_id)

  try:
    return render_to_response('youtube/view.html', {
      'video': video,
      'related': api.related(video.get_id())['items']
    })
  except IndexError:
    raise Http404()

def react_view(req, video_id):
  video = api.one_video(video_id)

  autoplay = req.GET.get('autoplay') not in ['0', 'false', 'no', 'off']
  try:
    return render_to_response('youtube/react/view.html', {
      'video': video,
      'autoplay': autoplay,
    })
  except IndexError:
    raise Http404()
