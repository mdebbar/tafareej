from django.conf.urls import patterns, url

urlpatterns = patterns('',
  url(r'^search/(?P<query>.+)/$', 'youtube.views.search', name='video_search'),
  url(r'^s/(?P<query>.+)/$', 'youtube.views.search'),

  # TODO: remove these when you don't need them anymore
  url(r'^videos/(?P<query>.+)/$', 'youtube.views.details'),
  url(r'^details/(?P<query>.+)/$', 'youtube.views.details'),

  url(r'^related/(?P<video_id>[-_\w]+)/$', 'youtube.views.related', name='related_videos'),
  url(r'^r/(?P<video_id>[-_\w]+)/$', 'youtube.views.related'),

  url(r'^popular/$', 'youtube.views.popular'),
  url(r'^$', 'youtube.views.popular'),

  url(r'^view/(?P<video_id>[-_\w]+)/$', 'youtube.views.react'),
  url(r'^(?P<video_id>[-_\w]+)/$', 'youtube.views.react', name='view_video'),
)

urlpatterns += patterns('',
  url(r'^react/(?P<video_id>[-_\w]+)/$', 'youtube.views.react'),
)

# JSON API
urlpatterns += patterns('',
  url(r'^api/search/(?P<query>.+)/$', 'youtube.views.api_search'),
  url(r'^api/related/(?P<video_id>[-_\w]+)/$', 'youtube.views.api_related'),
  url(r'^api/(?P<video_id>[-_\w]+)/$', 'youtube.views.api_one'),
)
