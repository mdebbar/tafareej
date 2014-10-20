import cherrypy
from conf import conf

app = cherrypy.tree.mount(None, config=conf)
cherrypy.quickstart(app)
