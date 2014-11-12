#! /bin/bash

# Usage:
# sh ./build.sh --android --reload

OpenColor="\033["
Red="1;31m"
Yellow="1;33m"
Green="1;32m"
CloseColor="\033[0m"

# Check function OK
checkOK() {
  if [ $? != 0 ]; then
    echo "${OpenColor}${Red}* ERROR. Exiting...${CloseColor}"
    exit 1
  fi
}

# Configs
BUILDDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cp $BUILDDIR/android/AndroidManifest.xml $BUILDDIR/platforms/android/AndroidManifest.xml
checkOK

cp $BUILDDIR/android/project.properties $BUILDDIR/platforms/android/project.properties
checkOK

cp -R $BUILDDIR/android/res/* $BUILDDIR/platforms/android/res
checkOK

cp -R $BUILDDIR/ios/icons/* $BUILDDIR/platforms/ios/Copay/Resources/icons
checkOK

cp -R $BUILDDIR/ios/splash/* $BUILDDIR/platforms/ios/Copay/Resources/splash
checkOK

echo "${OpenColor}${Green}Done!${CloseColor}"
