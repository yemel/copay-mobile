angular.module('copay.services', [])

    .factory('DataSrv', function ($ionicLoading, $timeout) {
        return {
            loginToApp: function (username, pwd, callback) {
                var data,
                    err  = null;

                $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i> Doing something...'
                });

                if (username === 'a' && pwd === 'a') {
                    data = true;
                } else {
                    data = false;
                    err = { message: "Invalid Login"};
                }

                $timeout(function () {
                    $ionicLoading.hide();
                    callback(err, data);
                }, 2000);
            }
        };
    });