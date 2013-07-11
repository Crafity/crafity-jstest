#!/bin/sh
cd ./lib/vendor
./updateJslint.sh
export errorCode=$?
if [ "0" != "$errorCode" ]; then
	exit $errorCode
fi
cd ../..
node ./test/package.test.js
node ./test/crafity.jstest.test.js
