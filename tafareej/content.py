import json
from tafareej.maps import FrozenDict


class DataObject(FrozenDict):

  def __getattr__(self, name):
    try:
      val = self[name]
      if isinstance(val, dict):
        return DataObject(val)
      else:
        return val
    except KeyError, e:
      raise AttributeError(e)

  def __repr__(self):
    return '<DataObject %s>' % super(FrozenDict, self).__repr__()



class AbstractContent(DataObject):

  def raise_abstract(self, method):
    raise NotImplementedError('%s.%s() is not implemented!' % (self.__class__.__name__, method))

  def dict(self):
    return {
      'type': self.get_type(),
      'id': self.get_id(),
      'title': self.get_title(),
      'url': self.get_url(),
      'excerpt': self.get_excerpt(),
      'thumbnail': self.get_thumbnail(),
    }

  def jsonify(self):
    return json.dumps(self.dict())

  def get_snippet_template(self):
    """The template for the snippet of this content"""
    return 'snippet.html'

  def get_type(self):
    """The Type of the content"""
    self.raise_abstract('get_type')

  def get_url(self):
    """The URL of the content"""
    self.raise_abstract('get_url')

  def get_id(self):
    """The ID of the content"""
    self.raise_abstract('get_id')

  def get_title(self):
    """The title of the content"""
    self.raise_abstract('get_title')

  def get_excerpt(self):
    """The short excerpt of the content"""
    self.raise_abstract('get_excerpt')

  def get_thumbnail(self):
    """The thumbnail of the content"""
    self.raise_abstract('get_thumbnail')
