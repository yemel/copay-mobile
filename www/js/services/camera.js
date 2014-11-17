'use strict'

angular.module('copay.services')

.factory('Camera', function($window, $cordovaBarcodeScanner, $ionicModal, $ionicPopup, Notifications, Decoder) {

  function Camera() {
    this.isNative = !!$window.cordova;
  };

  Camera.prototype.open = function(result) {
    if (!this.isNative) {
      var data = $window.prompt("Insert scanned data");
      return data ? onScan(data) : onError();
    }

    $cordovaBarcodeScanner.scan().then(onCamera, onError);
  };

  function onCamera(result) {
    if (result.cancelled) {
      // Copyrighted Hack: http://marsbomber.com/2014/05/29/BarcodeScanner-With-Ionic/
      // Open a modal to eat the unhandled back-button event.
      $ionicModal.fromTemplate('').show().then(function() {
        $ionicPopup.alert({
          title: 'Scan Cancelled',
          template: 'Maybe some other time'
        });
      });
    } else {
      onScan(result.text);
    }
  }

  function onScan(data) {
    var success = Decoder.process(data);
    if (!success) onError("Unknown format");
  }

  function onError(error) {
    error = error || "Nothing to scan there";
    Notifications.toast(error);
  }

  return new Camera();
});
