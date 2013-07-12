#!/bin/sh

export ScriptsDir="`dirname $0`"
export CurrentDir=`pwd`

echo ===== $ScriptsDir ====

$ScriptsDir/npm-update-jslint.sh
export ErrorCode=$?
if [ "0" != "$ErrorCode" ]; then
	exit $ErrorCode
fi

find * | grep -v -e "^node\_modules" | xargs -n 1 $ScriptsDir/npm-jslint-file.sh
export ErrorCode=$?

if [ "0" != "$ErrorCode" ]; then
	exit $ErrorCode
fi
