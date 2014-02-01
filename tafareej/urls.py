from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView

urlpatterns = patterns('',
  # Uncomment the next line to enable the admin:
  # url(r'^admin/', include(admin.site.urls)),

  url('^$', include('youtube.urls')),
  url('^youtube/', include('youtube.urls')),
  url('^yt/', include('youtube.urls')),
)
