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
            $scope.usernameValidate = true;
            $ionicLoading.hide();
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

    .controller('ProfileCtrl', function ($scope, $state) {
        $scope.profile = {
            name: 'Yemel Jardi',
            email: 'angel.jardi@gmail.com',
            displayUnit: 'BTC',
            alternativeCurrency: 'USD',
        }
        $scope.wallets = [
            {id: 1, name: 'Personal', copayers: 1, threshold: 1},
            {id: 2, name: 'BitPay BsAs', copayers: 3, threshold: 2},
            {id: 3, name: 'Roomates', copayers: 4, threshold: 2},
        ];
    })

    .controller('WalletCtrl', function ($scope, $state) {
        $scope.wallet = {
            name: 'Personal Wallet',
        };
    })

    .controller('HomeCtrl', function ($scope, $state) {
    })

    .controller('HomeCtrl', function ($scope, $state) {
    })

    .controller('ReceiveCtrl', function ($scope, $state) {
    })

    .controller('SendCtrl', function ($scope, $state) {
    })

    .controller('HistoryCtrl', function ($scope, $state) {
    })