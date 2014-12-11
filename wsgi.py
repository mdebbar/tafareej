import cherrypy

from conf import conf

# Expose an application that could be used to start a server
application = cherrypy.Application(None, config=conf)
