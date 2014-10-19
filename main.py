import os, sys, cherrypy

sys.path.append(os.path.dirname(__file__))

from conf import conf

app = cherrypy.tree.mount(None, config=conf)
cherrypy.quickstart(app)
