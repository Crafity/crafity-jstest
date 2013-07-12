#!/bin/bash

## NPM Post Install Script

export ScriptsDir="`dirname $0`"
$ScriptsDir/npm-update-jslint.sh
