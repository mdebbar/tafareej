import sys
from cherrypy import wsgiserver

from wsgi import application

def run(host, port):
  server = wsgiserver.CherryPyWSGIServer((host, port), application)
  try:
    server.start()
  except (KeyboardInterrupt, SystemExit) as e:
    print 'Stopping the server'
    server.stop()


if __name__ == '__main__':
  host = '127.0.0.1'
  try:
    port = sys.argv[1]
    if port.find(':') > -1:
      host, port = port.split(':', 1)
    port = int(port)
  except IndexError:
    raise Exception('You have to pass a port or host:port')
  except ValueError:
    import traceback; traceback.print_exc()
    raise Exception('The port number must be of type int')

  run(host, port)



