'use strict'

angular.module('copay.controllers')

.controller('SettingsCtrl', function($scope, $state, $ionicLoading, Config) {

  $scope.data = {
    insight: Config.network.livenet.url,
    testinsight: Config.network.testnet.url,
    useRemote: Config.plugins.EncryptedInsightStorage || false
  };
  $scope.submit = function(form) {
    Config.useRemote = $scope.data.useRemote;
    Config.network.livenet.url = $scope.data.insight;
    Config.network.testnet.url = $scope.data.testinsight;
    Config.plugins.EncryptedInsightStorage = $scope.data.useRemote;
    Config.plugins.EncryptedLocalStorage = !$scope.data.useRemote;
    Config.EncryptedInsightStorage = {
      url: (
        $scope.data.useTestnet
        ? $scope.data.testinsight
        : $scope.data.insight
      ) + '/api/email'
    };
    Config.savePreferences();
    $state.go('start.welcome');
  };
});
