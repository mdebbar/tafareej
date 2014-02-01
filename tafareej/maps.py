def merge(map1, *other_maps, **kwargs):
  result = dict(map1)
  for other_dict in other_maps:
    result.update(other_dict)
  if kwargs:
    result.update(kwargs)
  return result


def xget(map, *keys):
  """
  Smart dictionary access:
    d = {'a':2, 'b':{'c':3},'d':{'e':{'f':10}}}

    xget(d, 'a') => 2
    xget(d, 'b.c') => 3
    xget(d, 'a.b') => None
    xget(d, 'd.e.f') => 10
    xget(d, 'd.e') => {'f': 10}

    Fallback keys:
    xget(d, 'a.b', 'b') => {'c': 3}
  """
  for k in keys:
    k_parts = k.split('.')
    val = map
    for ii, part in enumerate(k_parts):
      try:
        if part in val:
          val = val[part]
          if ii == len(k_parts) - 1:
            return val
        else: break
      except TypeError:
        # TypeError will be raised if `val` is not iterable
        break
  return None

def xset(map, key, val):
  k_parts = key.split('.')
  _map = map
  for ii, part in enumerate(k_parts):
    try:
      if ii == len(k_parts) - 1:
        _map[part] = val
        break
      if not part in _map:
        _map[part] = {}
      _map = _map[part]
    except TypeError:
      # TypeError will be raised if `val` is not iterable
      break
  return map

def iter_for_key(maps, key, default=None):
  if isinstance(maps, dict):
    for map_key, map in maps.iteritems():
      yield (map_key, xget(map, key) or default)
  else:
    for map in maps or []:
      yield xget(map, key) or default


class FrozenDict(dict):
  def __init__(self, *args, **kwargs):
    super(FrozenDict, self).__init__(*args, **kwargs)

  def __repr__(self):
    return '<FrozenDict %s>' % super(FrozenDict, self).__repr__()

  def __setitem__(self, key, value):
    raise TypeError("'FrozenDict' object does not support item assignment")

  def copy(self, *args, **kwargs):
    return FrozenDict(self, *args, **kwargs)


