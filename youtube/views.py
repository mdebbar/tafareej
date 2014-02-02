from django.http.response import Http404
from django.shortcuts import render_to_response, render
from tafareej import JsonResponse
from tafareej.decorators import jsonable
from youtube import api


@jsonable
def search(req, query):
  response = api.search(query, part='id,snippet', **req.GET)

  if req.is_json:
    return JsonResponse(response)
  if req.is_ajax():
    return render(req, 'youtube/snippet-list.html', {
      'video_list': response['items'],
    })
  return render(req, 'youtube/results.html', {
    'title': query,
    'query': query,
    'videos': response['items'],
  })

@jsonable
def details(req, query):
  videos = api.searchWithDetails(query, **req.GET)

  if req.is_json:
    return JsonResponse(videos)
  return render(req, 'youtube/results.html', {
    'title': query,
    'query': query,
    'videos': videos['items'],
  })

@jsonable
def related(req, video_id):
  related_videos = api.related(video_id, **req.GET)

  if req.is_json:
    return JsonResponse(related_videos)
  if req.is_ajax():
    return render(req, 'youtube/snippet-list.html', {
      'video_list': related_videos['items'],
    })
  return render(req, 'youtube/results.html', {
    'title': video_id,
    'query': video_id,
    'videos': related_videos['items'],
  })

@jsonable
def popular(req):
  popular_videos = api.popular(**req.GET)

  if req.is_json:
    return JsonResponse(popular_videos)
  return render(req, 'youtube/results.html', {
    'title': 'Popular Videos',
    'query': '',
    'videos': popular_videos['items'],
  })

@jsonable
def view(req, video_id):
  video = api.one_video(video_id)

  if req.is_json:
    return JsonResponse(video.dict())
  try:
    return render_to_response('youtube/view.html', {
      'video': video,
      'related': api.related(video.get_id())['items']
    })
  except IndexError:
    raise Http404()
