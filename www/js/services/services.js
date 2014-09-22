angular.module('copay.services', [])

.factory('DataSrv', function() {
    return {
        loginToApp: function(username, pwd){
            if (username == 'a' && pwd == 'a')
            {
                return true
            } else{
                return false;
            }
        }
    }
});