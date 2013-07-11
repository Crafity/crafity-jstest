#!/bin/sh
rm jslint.js* jslint.module.js
wget -nv https://raw.github.com/douglascrockford/JSLint/master/jslint.js
sed -e '/JSLINT here/r jslint.js' ./jslint.module.template.js > ./jslint.module.js
