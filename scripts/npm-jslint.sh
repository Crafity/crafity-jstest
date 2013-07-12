#!/bin/bash

## Run JSLint in the current dir and all subfolders

export ScriptsDir="`dirname $0`"
export CurrentDir=`pwd`

# First update JSLint by downloading it directly from the github directory

#$ScriptsDir/npm-update-jslint.sh
#export ErrorCode=$?
#if [ "0" != "$ErrorCode" ]; then
#	exit $ErrorCode
#fi

# Find all the JS files and call the jslint script to check them

find * | grep -v -e "^node\_modules" | xargs -n 1 $ScriptsDir/npm-jslint-file.sh
export ErrorCode=$?

if [ "0" != "$ErrorCode" ]; then
	exit $ErrorCode
fi
