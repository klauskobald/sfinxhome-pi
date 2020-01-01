#!/usr/bin/env bash

TARGET="YOUR-SERVER+PATH"

cd "$(dirname "$0")"
echo "exporting m3u files..."
node generate
echo "pushing m3u files..."
rsync -e "ssh" -avz .m3u/* $TARGET