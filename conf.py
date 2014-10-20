import os
import pages
from util.routing import gen_dispatcher
from ajax import youtube

routes = youtube.routes + pages.routes

conf = {
  '/': {
    'request.dispatch': gen_dispatcher(*routes),
    #TODO: use better paths
    'tools.staticdir.root': os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
  },
  '/js': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': 'js',
  },
  '/css': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': 'css',
  },
  '/img': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': 'img',
  },
  '/fonts': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': 'fonts',
  },
}
