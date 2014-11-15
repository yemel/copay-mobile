'use strict'

angular.module('copay', [
  'ionic',
  'monospaced.qrcode',
  'yaru22.angular-timeago',
  'truncate',
  'ngCordova',
  'ui.gravatar',

  'copay.controllers',
  'copay.services',
  'copay.directives',
  'copay.filters'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
  });
});

angular.module('ui.gravatar').config([
  'gravatarServiceProvider', function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size     : 100,
      "default": 'mm'
    };
  }
]);

angular.module('copay.services', []);
angular.module('copay.controllers', []);
