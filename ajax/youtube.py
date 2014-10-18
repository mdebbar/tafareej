import json
import sys, os
import cherrypy

APP_DIR = os.path.dirname(os.path.dirname(__file__))
print APP_DIR
sys.path.append(APP_DIR)

from external.youtube import api


class HelloWorld(object):
  @cherrypy.expose
  def index(self):
    return "Hello World!"

  @cherrypy.expose
  def search(self):
    response = api.searchWithDetails('rihanna')
    response['items'] = tuple(video.dict() for video in response['items'])
    return json.dumps(response)

cherrypy.quickstart(HelloWorld())
