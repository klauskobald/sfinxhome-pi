

git submodule update --recursive



using lists from:
https://github.com/iptv-org/iptv


ffprobe -i http://161.0.157.5/PLTV/88888888/224/32212270430/index.m3u8 -hide_banner
[http @ 0x9eb1c0] HTTP error 404 Not Found

ffprobe -i http://161.0.157.5/PLTV/88888888/224/3221227040/index.m3u8 -hide_banner
Input #0, hls,applehttp, from 'http://161.0.157.5/PLTV/88888888/224/3221227040/index.m3u8':
  Duration: N/A, start: 41631.442211, bitrate: N/A
  Program 0
    Metadata:
      variant_bitrate : 1099110
    Stream #0:0: Video: h264 (Main) ([27][0][0][0] / 0x001B), yuv420p(tv, smpte170m), 640x360 [SAR 1:1 DAR 16:9], 29.97 fps, 29.97 tbr, 90k tbn, 59.94 tbc
    Metadata:
      variant_bitrate : 1099110
    Stream #0:1: Audio: aac (LC) ([15][0][0][0] / 0x000F), 48000 Hz, stereo, fltp
    Metadata:
      variant_bitrate : 1099110
    Stream #0:2: Audio: aac (LC) ([15][0][0][0] / 0x000F), 48000 Hz, stereo, fltp
    Metadata:
      variant_bitrate : 1099110
  Program 1
    Metadata:
      variant_bitrate : 1849066
    Stream #0:3: Video: h264 (Main) ([27][0][0][0] / 0x001B), yuv420p(tv, smpte170m), 720x480 [SAR 40:33 DAR 20:11], 29.97 fps, 29.97 tbr, 90k tbn, 59.94 tbc
    Metadata:
      variant_bitrate : 1849066
    Stream #0:4: Audio: aac (LC) ([15][0][0][0] / 0x000F), 48000 Hz, stereo, fltp
    Metadata:
      variant_bitrate : 1849066
    Stream #0:5: Audio: aac (LC) ([15][0][0][0] / 0x000F), 48000 Hz, stereo, fltp
    Metadata:
      variant_bitrate : 1849066
  Program 2
    Metadata:
      variant_bitrate : 3348979
    Stream #0:6: Video: h264 (High) ([27][0][0][0] / 0x001B), yuv420p(tv, bt709), 1280x720 [SAR 1:1 DAR 16:9], 29.97 fps, 29.97 tbr, 90k tbn, 59.94 tbc
    Metadata:
      variant_bitrate : 3348979
    Stream #0:7: Audio: aac (LC) ([15][0][0][0] / 0x000F), 48000 Hz, stereo, fltp
    Metadata:
      variant_bitrate : 3348979
    Stream #0:8: Audio: aac (LC) ([15][0][0][0] / 0x000F), 48000 Hz, stereo, fltp
    Metadata:
      variant_bitrate : 3348979

