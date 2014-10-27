'use strict'

angular.module('copay.services')

.factory('Notifications', function($window, $ionicLoading, $cordovaToast) {

  function Notifications() {
    this.isNative = !!$window.cordova;
  };

  Notifications.prototype.toast = function(message) {
    // Show somethig at the browser, for developing ease
    if (!this.isNative) {
      $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    } else {
      $cordovaToast.showLongBottom(message);
    }
  };

  return new Notifications();
});
