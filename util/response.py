import os
import cherrypy
import json as JSON
from mako.lookup import TemplateLookup

from jschunks import get_chunk_asset


def make_decorator(deco_fn):
  """
  This makes decorators take directly the function followed by the arguments. e.g:

  @make_decorator
  def my_deco(fn, option1=False, option2=True):
    ...

  @my_deco(option1='me', option2='you'):
  def my_fn():
    ...
  """
  def outer_deco(*args, **kwargs):
    def inner_deco(fn):
      return deco_fn(fn, *args, **kwargs)
    return inner_deco
  return outer_deco


@make_decorator
def allow_cors(fn, origin='*'):
  def actual(*args, **kwargs):
    cherrypy.response.headers['Access-Control-Allow-Origin'] = origin
    cherrypy.response.headers['Access-Control-Allow-Headers'] =\
      'Origin, X-Requested-With, Content-Type, Accept'
    # If it's an OPTIONS request, don't waste time generating the response
    if cherrypy.request.method == 'OPTIONS':
      return ''
    return fn(*args, **kwargs)
  return actual

@make_decorator
def content_type(fn, ctype):
  def actual(*args, **kwargs):
    cherrypy.response.headers['Content-Type'] = ctype
    return fn(*args, **kwargs)
  return actual

@make_decorator
def json(fn, jsonify=True, allow_jsonp=True, callback='callback'):
  @content_type('text/javascript')
  def actual(*args, **kwargs):
    out = fn(*args, **kwargs)
    if (jsonify):
      out = JSON.dumps(out)
    if allow_jsonp and callback in kwargs:
      out = '%(cb)s && %(cb)s(%(out)s);' % {'cb': kwargs[callback], 'out': out}
    return out
  return actual


#TODO: use better paths
template_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'templates')
template_lookup = TemplateLookup(directories=template_dir)

@make_decorator
def template(fn, template_name, jschunks=None):
  def actual(*args, **kwargs):
    data = fn(*args, **kwargs)
    jsentries = [get_chunk_asset(chunk) for chunk in jschunks or []]
    temp = template_lookup.get_template(template_name)
    return temp.render(jsentries=jsentries, **data)
  return actual
