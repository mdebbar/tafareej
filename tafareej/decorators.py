import traceback

def jsonable(func):
  def inner(req, *args, **kwargs):
    req.GET = req.GET.dict()
    req.is_json = req.GET.pop('json', False)
    return func(req, *args, **kwargs)
  return inner


def retry(func, max_attempts=3):
  def inner(*args, **kwargs):
    attempts = 0
    while attempts < max_attempts:
      try:
        return func(*args, **kwargs)
      except Exception, e:
        traceback.print_exc()
        attempts += 1
    raise e
  return inner
