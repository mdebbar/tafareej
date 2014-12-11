#!/bin/bash

for PORT in $@
do
  nohup python server.py $PORT &
done

