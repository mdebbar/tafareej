from django.conf.urls import patterns, url

urlpatterns = patterns('',
  url(r'^view/(?P<video_id>[-_\w]+)/$', 'youtube.views.view'),
  url(r'^(?P<video_id>[-_\w]+)/$', 'youtube.views.view', name='view_video'),
)

# JSON API
urlpatterns += patterns('',
  url(r'^api/search/(?P<query>.+)/page/(?P<page_token>.+)/$', 'youtube.views.api_search'),
  url(r'^api/search/(?P<query>.+)/$', 'youtube.views.api_search'),

  url(r'^api/related/(?P<video_id>[-_\w]+)/page/(?P<page_token>.+)/$', 'youtube.views.api_related'),
  url(r'^api/related/(?P<video_id>[-_\w]+)/$', 'youtube.views.api_related'),

  url(r'^api/autocomplete/(?P<query>.+)/$', 'youtube.views.api_autocomplete'),

  url(r'^api/(?P<video_id>[-_\w]+)/$', 'youtube.views.api_one'),
)
