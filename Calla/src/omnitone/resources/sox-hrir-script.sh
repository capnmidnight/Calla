# Copyright 2017 Google Inc. All Rights Reserved.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#!/bin/bash

# This script generates a set of HRIR files for Omnitone from GoogleVR's
# original HRIR files. It also produces a documentation on generated HRIR files.

TAG="[omnitone:build-hrir]"


# Check SoX installation.
if hash sox 2>/dev/null; then
  echo "$TAG SoX found. Starting..."
else 
  echo "$TAG SoX not found! Install SoX to build HRIR files."
  exit 1
fi


# Get current directory and check if the required files exist.
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RESOURCE_DIR="$CURRENT_DIR"
FOA_HRIR_PATH="$RESOURCE_DIR/sh_hrir_order_1.wav"
SOA_HRIR_PATH="$RESOURCE_DIR/sh_hrir_order_2.wav"
TOA_HRIR_PATH="$RESOURCE_DIR/sh_hrir_order_3.wav"

if [ -e "$FOA_HRIR_PATH" ] && \
   [ -e "$SOA_HRIR_PATH" ] && \
   [ -e "$TOA_HRIR_PATH" ]; then
  echo "$TAG All 3 source HRIR files exists. Generating Omnitone HRIR set..."
else
  echo "$TAG Could not find source HRIR files. Check the current directory."
  exit 1
fi


# Check MD5 sums for the source HRIR files.
case $OSTYPE in
  "darwin"*) MD5_GENERATOR="md5 -q" ;;
  "linux-gnu") MD5_GENERATOR="md5sum" ;;
esac

MD5_CHECKSUM_FOA_SOURCE=`$MD5_GENERATOR $FOA_HRIR_PATH`
MD5_CHECKSUM_SOA_SOURCE=`$MD5_GENERATOR $SOA_HRIR_PATH`
MD5_CHECKSUM_TOA_SOURCE=`$MD5_GENERATOR $TOA_HRIR_PATH`

echo "$TAG Checking MD5 check sum for the source HRIR files:"
echo " - FOA HRIR MD5 =" $MD5_CHECKSUM_FOA_SOURCE
echo " - SOA HRIR MD5 =" $MD5_CHECKSUM_SOA_SOURCE
echo " - TOA HRIR MD5 =" $MD5_CHECKSUM_TOA_SOURCE

# HRIR set path
FOA_HRIR_SET_PATH=(
  "$RESOURCE_DIR/omnitone-foa-1.wav"
  "$RESOURCE_DIR/omnitone-foa-2.wav"
)
SOA_HRIR_SET_PATH=(
  "$RESOURCE_DIR/omnitone-soa-1.wav"
  "$RESOURCE_DIR/omnitone-soa-2.wav"
  "$RESOURCE_DIR/omnitone-soa-3.wav"
  "$RESOURCE_DIR/omnitone-soa-4.wav"
  "$RESOURCE_DIR/omnitone-soa-5.wav"
)
TOA_HRIR_SET_PATH=(
  "$RESOURCE_DIR/omnitone-toa-1.wav"
  "$RESOURCE_DIR/omnitone-toa-2.wav"
  "$RESOURCE_DIR/omnitone-toa-3.wav"
  "$RESOURCE_DIR/omnitone-toa-4.wav"
  "$RESOURCE_DIR/omnitone-toa-5.wav"
  "$RESOURCE_DIR/omnitone-toa-6.wav"
  "$RESOURCE_DIR/omnitone-toa-7.wav"
  "$RESOURCE_DIR/omnitone-toa-8.wav"
)


# Generate Omnitone HRIR sets
echo "$TAG Generating Omnitone FOA HRIR sets... (2 stereo files)"
sox $FOA_HRIR_PATH ${FOA_HRIR_SET_PATH[0]} remix 1 2
sox $FOA_HRIR_PATH ${FOA_HRIR_SET_PATH[1]} remix 3 4
echo "$TAG Done."

echo "$TAG Generating Omnitone SOA HRIR sets... (5 stereo files)"
sox $SOA_HRIR_PATH ${SOA_HRIR_SET_PATH[0]} remix 1 2
sox $SOA_HRIR_PATH ${SOA_HRIR_SET_PATH[1]} remix 3 4
sox $SOA_HRIR_PATH ${SOA_HRIR_SET_PATH[2]} remix 5 6
sox $SOA_HRIR_PATH ${SOA_HRIR_SET_PATH[3]} remix 7 8
sox $SOA_HRIR_PATH ${SOA_HRIR_SET_PATH[4]} remix 9 0
echo "$TAG Done."

echo "$TAG Generating Omnitone SOA HRIR sets... (8 stereo files)"
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[0]} remix 1 2
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[1]} remix 3 4
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[2]} remix 5 6
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[3]} remix 7 8
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[4]} remix 9 10
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[5]} remix 11 12
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[6]} remix 13 14
sox $TOA_HRIR_PATH ${TOA_HRIR_SET_PATH[7]} remix 15 16
echo "$TAG Done."


# Verification
TEMP_DIR=".build_hrir_temp_dir"
mkdir $TEMP_DIR

# FOA
sox -t wav $FOA_HRIR_PATH $TEMP_DIR/foa-a.wav
sox --combine merge ${FOA_HRIR_SET_PATH[*]} $TEMP_DIR/foa-b.wav
MD5_CHECKSUM_FOA_SOURCE=`$MD5_GENERATOR $TEMP_DIR/foa-a.wav`
MD5_CHECKSUM_FOA_MERGED=`$MD5_GENERATOR $TEMP_DIR/foa-b.wav`
if [ $MD5_CHECKSUM_FOA_SOURCE == $MD5_CHECKSUM_FOA_MERGED ]; then
  echo "$TAG FOA HRIR set successfully verified:" 
  echo " - MD5 =" $MD5_CHECKSUM_FOA_MERGED "(both sanitized source and merged)"
else
  echo "$TAG FOA HRIR set verification failed:"
  echo " - SOURCE =" $MD5_CHECKSUM_FOA_SOURCE
  echo " - MERGED =" $MD5_CHECKSUM_FOA_MERGED
fi

# SOA
sox -t wav $SOA_HRIR_PATH $TEMP_DIR/soa-a.wav
sox --combine merge ${SOA_HRIR_SET_PATH[*]} $TEMP_DIR/soa-b.wav \
  remix 1 2 3 4 5 6 7 8 9
MD5_CHECKSUM_SOA_SOURCE=`$MD5_GENERATOR $TEMP_DIR/soa-a.wav`
MD5_CHECKSUM_SOA_MERGED=`$MD5_GENERATOR $TEMP_DIR/soa-b.wav`
if [ $MD5_CHECKSUM_SOA_SOURCE == $MD5_CHECKSUM_SOA_MERGED ]; then
  echo "$TAG SOA HRIR set successfully verified:" 
  echo " - MD5 =" $MD5_CHECKSUM_SOA_MERGED "(both sanitized source and merged)"
else
  echo "$TAG SOA HRIR set verification failed:"
  echo " - SOURCE =" $MD5_CHECKSUM_SOA_SOURCE
  echo " - MERGED =" $MD5_CHECKSUM_SOA_MERGED
fi

# TOA
sox -t wav $TOA_HRIR_PATH $TEMP_DIR/toa-a.wav
sox --combine merge ${TOA_HRIR_SET_PATH[*]} $TEMP_DIR/toa-b.wav
MD5_CHECKSUM_TOA_SOURCE=`$MD5_GENERATOR $TEMP_DIR/toa-a.wav`
MD5_CHECKSUM_TOA_MERGED=`$MD5_GENERATOR $TEMP_DIR/toa-b.wav`
if [ $MD5_CHECKSUM_TOA_SOURCE == $MD5_CHECKSUM_TOA_MERGED ]; then
  echo "$TAG TOA HRIR set successfully verified:" 
  echo " - MD5 =" $MD5_CHECKSUM_TOA_MERGED "(both sanitized source and merged)"
else
  echo "$TAG TOA HRIR set verification failed:"
  echo " - SOURCE =" $MD5_CHECKSUM_TOA_SOURCE
  echo " - MERGED =" $MD5_CHECKSUM_TOA_MERGED
fi

rm -rf $TEMP_DIR


# Finalizing
echo "$TAG Building HRIR sets completed successfully."
