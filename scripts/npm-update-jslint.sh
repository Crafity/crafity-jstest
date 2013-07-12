#!/bin/bash

## Download the latest version of JSLint and make it a commonJS module

export ScriptsDir="`dirname $0`"
export CurrentDir=`pwd`
export JSLintDir="$ScriptsDir/../lib/jslint"

if [ -f "$JSLintDir/~jslint.js*" ]; then
	rm $JSLintDir/~jslint.js*;
fi
if [ -f "$JSLintDir/~jslint.module.js" ]; then
	rm $JSLintDir/~jslint.module.js;
fi

wget -nv -O $JSLintDir/~jslint.js https://raw.github.com/douglascrockford/JSLint/master/jslint.js
export ErrorCode=$?
if [ "0" != "$ErrorCode" ]; then
	exit $ErrorCode
fi
sed -e "/JSLINT here/r $JSLintDir/~jslint.js" $JSLintDir/jslint.module.template.js > $JSLintDir/~jslint.module.js
export ErrorCode=$?
if [ "0" != "$ErrorCode" ]; then
	exit $ErrorCode
fi
