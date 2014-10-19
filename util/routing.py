import cherrypy

def gen_dispatcher(*routes):
  """
  Generate a dispatcher from a list of routes. Each route has to be in this format:
  (name, path, controller)
  """
  dispatcher = cherrypy.dispatch.RoutesDispatcher()
  for route in routes:
    dispatcher.connect(*route)
  return dispatcher
