#!/bin/bash
while true
do
 node master.js "${1}" $2
 sleep 1
done