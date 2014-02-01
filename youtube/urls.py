from django.conf.urls import patterns, url

urlpatterns = patterns('',
  url('^search/(?P<query>.+)/$', 'youtube.views.search'),

  url('^videos/(?P<query>.+)/$', 'youtube.views.details'),
  url('^details/(?P<query>.+)/$', 'youtube.views.details'),

  url('^related/(?P<video_id>.+)/$', 'youtube.views.related'),
  url('^popular/$', 'youtube.views.popular'),

  url('^view/(?P<video_id>.+)/$', 'youtube.views.view'),
  url('^(?P<video_id>.+)/$', 'youtube.views.view'),

  url('^$', 'youtube.views.popular'),
)
