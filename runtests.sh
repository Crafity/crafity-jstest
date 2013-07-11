#!/bin/sh
cd ./lib/vendor
./refresh.sh
cd ../..
node ./test/package.test.js
node ./test/crafity.jstest.test.js
