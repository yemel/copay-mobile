angular.module('copay.services', [])

    .factory('DataSrv', function ($ionicLoading, $timeout) {
        return {
            loginToApp: function (username, pwd, callback) {
                var data = null,
                    err  = false;

                if (username === 'a' && pwd === 'a') {
                    data = {name: "John", lastname: "Doe", birthdate: '04/04/04'};
                }

                //err = { message: "Service Failed" };

                $timeout(function () {
                    callback(err, data);
                }, 2000);
            }
        };
    });