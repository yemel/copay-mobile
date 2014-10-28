'use strict'

angular.module('copay.controllers')

.controller('ProfileCtrl', function($scope, $cordovaSocialSharing, Session) {

  $scope.backup = function() {

    var identity = Session.identity;
    var file = identity.exportEncryptedWithWalletInfo(identity.password);
    var filename = identity.email + '-profile.json';

    $cordovaSocialSharing.shareViaEmail(
      'Here is your encrypted backup for the profile ' + identity.email,
      'Copay - Profile Backup',
      [identity.email],
      file
    );

  };

});
