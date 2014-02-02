from django.conf.urls import patterns, url

urlpatterns = patterns('',
  url('^search/(?P<query>.+)/$', 'youtube.views.search'),

  url('^videos/(?P<query>.+)/$', 'youtube.views.details'),
  url('^details/(?P<query>.+)/$', 'youtube.views.details'),

  url('^related/(?P<video_id>.+)/$', 'youtube.views.related'),
  url('^popular/$', 'youtube.views.popular'),
  url('^$', 'youtube.views.popular'),

  url('^view/(?P<video_id>.+)/$', 'youtube.views.view'),
  url('^(?P<video_id>[-_\w]+)/$', 'youtube.views.view'),
)

urlpatterns += patterns('',
  url('^react/(?P<video_id>.+)/$', 'youtube.views.react'),
)

# JSON API
urlpatterns += patterns('',
  url('^api/search/(?P<query>.+)/$', 'youtube.views.api_search'),
  url('^api/related/(?P<video_id>.+)/$', 'youtube.views.api_related'),
  url('^api/(?P<video_id>[-_\w]+)/$', 'youtube.views.api_one'),
)
