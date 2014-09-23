angular.module('copay.services', [])

    .factory('DataSrv', function () {
        return {
            loginToApp: function (username, pwd) {
                var data;
                if (username === 'a' && pwd === 'a') {
                    data = true;
                } else {
                    data = false;
                }
                return {response: function (callback) {
                    callback(data);
                } };
            }
        };
    });