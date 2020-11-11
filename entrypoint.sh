#!/bin/sh -l

echo "Everything is alright!"
time=$(date)
echo "::set-output name=time::$time"