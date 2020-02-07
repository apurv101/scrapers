#!/bin/bash
while true
do
 node master_ho.js "${1}" $2
 sleep 1
done