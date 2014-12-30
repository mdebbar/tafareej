def merge(map1, *other_maps, **kwargs):
  result = dict(map1)
  for other_dict in other_maps:
    result.update(other_dict)
  if kwargs:
    result.update(kwargs)
  return result


