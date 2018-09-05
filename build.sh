#!/bin/bash
start=$(date +%s)

set -e

reset="\e[0m"
red="\e[0;31m"
green="\e[0;32m"
cyan="\e[0;36m"
white="\e[0;37m"

echo "begin build >>>>>>>>>>>>>"


echo "install deps"
npm install --registry=http://registry.npmjs.lianjia.com:7001
echo "build source"

npm run build

end=$(date +%s)
time=$(( $end - $start ))

echo "fe build in ($time) 秒"

# mkdir  'dist/editor'
# cp -rf 'libraries/editor/dist/' 'dist/editor/dist/'
