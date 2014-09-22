from django import template

register = template.Library()

META_TAG = '<meta property="og:%s" content="%s" />'

@register.simple_tag(name='og')
def og(title, content):
  return META_TAG % (title, content)
