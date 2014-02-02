from django import template
from django.contrib.staticfiles.templatetags.staticfiles import static

register = template.Library()

JS_IMPORT = '<script type="text/javascript" src="%s"></script>'
JSX_IMPORT = '<script type="text/jsx" src="%s"></script>'
CSS_IMPORT = '<link rel="stylesheet" type="text/css" href="%s" />'

@register.simple_tag(name='js')
def js(*paths):
  return ''.join(JS_IMPORT % static(p) for p in paths)

@register.simple_tag(name='css')
def css(*paths):
  return ''.join(CSS_IMPORT % static(p) for p in paths)

@register.simple_tag
def jsx(*paths):
  return ''.join(JSX_IMPORT % static(p) for p in paths)
