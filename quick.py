import cherrypy
import sys

from wsgi import application

DEFAULT_PORT = 8080

def run(port):
  conf = {
    'global': {
      'server.socket_host': '127.0.0.1',
      'server.socket_port': port,
    },
  }
  cherrypy.quickstart(application, config=conf)


if __name__ == '__main__':
  try:
    port = int(sys.argv[1])
  except:
    port = DEFAULT_PORT

  run(port)

