angular.module('copay.services', [])

    .factory('DataSrv', function ($ionicLoading, $timeout) {
        return {
            loginToApp: function (username, pwd, callback) {
                var data,
                    err  = null;

                if (username === 'a' && pwd === 'a') {
                    data = {name: "John", lastname: "Doe", birthdate: '04/04/04'};
                } else {
                    data = null;
                    err = { message: "Service Failed" };
                }

                $timeout(function () {
                    callback(err, data);
                }, 2000);
            }
        };
    });