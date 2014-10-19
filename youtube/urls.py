from django.conf.urls import patterns, url

urlpatterns = patterns('',
  url(r'^$', 'youtube.views.home'),

  url(r'^view/(?P<video_id>[-_\w]+)/$', 'youtube.views.view'),
  url(r'^(?P<video_id>[-_\w]+)/$', 'youtube.views.view', name='view_video'),
)
