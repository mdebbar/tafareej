import json
import traceback

def _get_chunks_stats():
  with open('webpack/stats/assetsByChunkName.json') as f:
    return json.loads(f.read())

def get_chunk_asset(chunkname):
  try:
    stats = _get_chunks_stats()
    if chunkname not in stats:
      print 'No asset was found for chunk: %s' % chunkname
      return ''

    assets = stats[chunkname]
    if isinstance(assets, basestring):
      return assets

    if isinstance(assets, list):
      return assets[0]
  except:
    traceback.print_exc()

  raise Exception('The file "assetsByChunkName.json" is malformed')
