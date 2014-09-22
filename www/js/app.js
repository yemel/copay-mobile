// Copay App

angular.module('copay', ['ionic', 'copay.controllers', 'copay.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordsova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('welcome', {
      url: "/",
      templateUrl: "templates/welcome.html",
    })

    .state('settings', {
      url: "/settings",
      templateUrl: "templates/settings.html",
    })

    .state('register', {
      url: "/register",
      templateUrl: "templates/register.html",
      controller: 'RegisterCtrl'
    })

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'RegisterCtrl'
    })

    .state('setPin', {
      templateUrl: "templates/pin.html",
      controller: 'SetPinCtrl'
    })

    .state('confirmPin', {
      templateUrl: "templates/pin.html",
      controller: 'ConfirmPinCtrl'
    })

    .state('profile', {
      url: "/profile",
      templateUrl: "templates/profile.html",
      controller: 'ProfileCtrl'
    })

    .state('wallet', {
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'WalletCtrl'
    })

    .state('wallet.home', {
      url: "/wallet/home",
      views: {
        'home-tab' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('wallet.receive', {
      url: "/wallet/receive",
      views: {
        'receive-tab' :{
          templateUrl: "templates/receive.html",
          controller: 'ReceiveCtrl'
        }
      }
    })

    .state('wallet.send', {
      url: "/wallet/send",
      views: {
        'send-tab' :{
          templateUrl: "templates/send.html",
          controller: 'SendCtrl'
        }
      }
    })

    .state('wallet.history', {
      url: "/wallet/history",
      views: {
        'history-tab' :{
          templateUrl: "templates/history.html",
          controller: 'HistoryCtrl'
        }
      }
    })

  $urlRouterProvider.otherwise('/');
});

