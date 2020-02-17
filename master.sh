#!/bin/bash
while true
do
 node master.js "${1}" $2 $3
 sleep 10
done