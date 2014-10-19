from util.routing import gen_dispatcher
from ajax import youtube

conf = {
  '/': {
    'request.dispatch': gen_dispatcher(*youtube.routes),
  },
}
