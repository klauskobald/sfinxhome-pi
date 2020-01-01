#!/usr/bin/env bash
cd "$(dirname "$0")"

sudo -h 127.0.0.1 mkdir /var/log/sfinxhome/ > /dev/null 2>1
sudo -h 127.0.0.1 chown pi /var/log/sfinxhome > /dev/null 2>1

git submodule update --recursive > /var/log/sfinxhome/git.log

# initial clone
# git submodule update --init --recursive

killall ffprobe > /dev/null
cd sfinxiptv
node test > /var/log/sfinxhome/test.log
killall ffprobe > /dev/null
