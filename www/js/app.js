'use strict'

angular.module('copay', [
  'ionic',
  'monospaced.qrcode',
  'yaru22.angular-timeago',
  'truncate',

  'copay.controllers',
  'copay.services',
  'copay.directives',
  'copay.filters'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordsova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

angular.module('copay.services', []);
angular.module('copay.controllers', []);
