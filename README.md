# Copay Mobile

The goal of this project is to create the best bitcoin wallet for mobiles by 
using the multisig power of Copay and making it context aware.


## Install

    $ sudo npm install -g cordova ionic
    $ git clone https://github.com/yemel/copay-mobile.git
    $ cd copay-mobile
    $ npm install
    $ bower install

## Run

Run it on the IOS emulator:

    $ ionic platform add ios
    $ ionic emulate ios

Run it on an Android device:

    $ ionic platform add android
    $ ionic run android

Test it on the web browser:

    $ ionic serve

You may check an online demo here: http://copay.herokuapp.com/