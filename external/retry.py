import traceback

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
