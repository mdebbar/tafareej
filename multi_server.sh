#!/bin/bash

# Clear the .pids file
> .pids

for PORT in $@
do
  filename="/var/log/cherrypy/log_"$PORT"_`date +%Y%m%d-%H%M%S`"
  nohup python server.py $PORT </dev/null >$filename 2>&1 &
  # Append the PID of the server to the .pids file
  echo $! >> .pids
done

