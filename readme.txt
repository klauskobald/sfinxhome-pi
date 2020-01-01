
This is an addon to https://github.com/iptv-org/iptv

Intention is to have a raspberry pi zero installed that checks which streams are actually working on that location.

sfinxhome-pi/update.sh
should run every day. it will pull the latest playlists from iptv-org and then run a test on each channel. That can take hours!
working data of each channel is stored into .channels. when a channel fails it will not be checked again in the next 2 hours. If a channel is ok it will not checked within 24 hours again.
When internet is not working process will wait for up to half an hour.

.env contains config values

push_to_public.sh should be copied to a file named push_to_my_server.sh. Set the TARGET there!
This will generate playlists for each selected country and not blacklisted group and then publish (rsync) all generated files to a server.
This script can be called every hour.

setup.sh will install the crontab (setup/cron.txt) for you.



warning!

go to directory sfinxiptv then run
node test
otherwise the wrong .env file would be used!


using lists from:
https://github.com/iptv-org/iptv

