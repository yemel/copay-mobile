angular.module('copay.controllers', [])

    .controller('RegisterCtrl', function ($scope, $state, DataSrv) {
        $scope.usernameValidate = false;
        $scope.submit = function (loginData) {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });
            if (loginData) {
                DataSrv.loginToApp(loginData.username, loginData.password, function (err, result) {
                    $ionicLoading.hide();
                    if (err) {
                        console.warn(err.message);
                    } else {
                        if (result) {
                            $state.go('setPin');
                        } else {
                            $scope.usernameValidate = true;
                        }
                    }
                });

            }
        };
    })

    .controller('SetPinCtrl', function ($scope, $state) {
        $scope.message = "Enter a 4-digit pin";
        $scope.digits = [];

        $scope.press = function (digit) {
            $scope.digits.push(digit);
            if ($scope.digits.length == 4) {
                $state.go('confirmPin');
            }
        };
    })

    .controller('ConfirmPinCtrl', function ($scope, $state) {
        $scope.message = "Confirm your 4-digit pin";
        $scope.digits = [];

        $scope.press = function (digit) {
            $scope.digits.push(digit);
            if ($scope.digits.length == 4) {
                $state.go('wallet.home');
            }
        };
    })
