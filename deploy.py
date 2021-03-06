import json
import os
import re
import sys
import subprocess

DIR = os.path.dirname(os.path.abspath(__file__))
SITE_CONF = os.path.join(DIR, 'deployment/sites.json')

STATIC_PUBLIC = os.path.join(DIR, 'static/public/')
ROBOTS_TXT = os.path.join(STATIC_PUBLIC, 'robots.txt')

SITE_CONF_TEMPLATE = os.path.join(DIR, 'deployment/nginx.site.conf.template')
NGINX_SITES = '/etc/nginx/conf.d/extra'


def main(site, branch='master'):
  site_conf = get_site_conf(site)
  git(branch)
  install()
  # old_assets = get_current_assets()
  build_js()
  # new_assets = get_current_assets()
  # now let's remove/archive the assets we don't need anymore.
  robots_txt(site_conf)
  setup_nginx(site, site_conf)
  server(site_conf['ports'])

def execute(command, failure_msg):
  if subprocess.call(command) != 0:
    raise Exception(failure_msg)

def get_site_conf(site):
  try:
    with open(SITE_CONF) as f:
      conf = json.loads(f.read())[site]
  except (OSError, IOError):
    raise
  except (TypeError, ValueError):
    raise Exception('Could not parse sites.json file')
  except KeyError:
    raise Exception('No config was found for site "%s"' % site)

  conf['servers'] = _get_site_servers(conf['ports'])
  return conf

def _get_site_servers(ports):
  return '\n    '.join(
    'server 127.0.0.1:%d;' % p for p in ports
  )

def git(branch):
  execute(
    ['sudo', 'git', 'pull'],
    'Could not pull from github',
  )
  execute(
    ['git', 'checkout', branch],
    'Could not checkout branch %s' % branch,
  )

def install():
  execute(
    ['npm', 'install'],
    'Could not install npm packages',
  )
  execute(
    ['pip', 'install', '-r', 'requirements.txt'],
    'Could not install python packages',
  )

def get_current_assets():
  """
  Return a list of assets currently available in static/build.
  Get it from webpack/stats/stats.json
  """
  pass

def build_js(production=True):
  """
  We could also have a different config for production using --config
  """
  mode = '-p' if production else '-d'
  execute(
    ['webpack', '--colors', '--progress', '--display-error-details', mode],
    'webpack could not build the resources',
  )

def robots_txt(site_conf):
  if 'robots.txt' not in site_conf:
    return
  with open(ROBOTS_TXT, 'w+') as f:
    f.write(site_conf['robots.txt'])

def setup_nginx(site, site_conf):
  with open(SITE_CONF_TEMPLATE) as f:
    content = re.sub(
      _get_pattern(site_conf),
      lambda x: site_conf[x.group().strip('<{}>')],
      f.read(),
    )
  with open(os.path.join(NGINX_SITES, 'nginx.%s.conf' % site), 'w+') as f:
    f.write(content)

def _get_pattern(site_conf):
  return '{{(%s)}}' % '|'.join(site_conf.iterkeys())

def server(ports):
  if os.path.isfile('.pids'):
    subprocess.call('cat .pids | xargs kill -KILL', shell=True)

  execute(
    ['./multi_server.sh'] + [str(p) for p in ports],
    'Could not start CherryPy servers',
  )
  execute(
    ['sudo', 'service', 'nginx', 'restart'],
    'Could not restart nginx service',
  )


if __name__ == '__main__':
  main(*sys.argv[1:])
