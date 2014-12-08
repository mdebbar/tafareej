import json

def _get_chunks_stats():
  with open('webpack/stats/assetsByChunkName.json') as f:
    return json.loads(f.read())

def get_chunk_asset(chunkname):
  try:
    assets = _get_chunks_stats()[chunkname]
    if isinstance(assets, basestring):
      return assets
    if isinstance(assets, list):
      return assets[0]
  except:
    pass
  raise Exception('The file "assetsByChunkName.json" is malformed')