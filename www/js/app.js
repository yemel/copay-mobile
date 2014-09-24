// Copay App

angular.module('copay', ['ionic', 'copay.controllers'])

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

    .state('start', {
      abstract: true,
      templateUrl: "templates/start.html"
    })

    .state('start.welcome', {
      url: "/",
      templateUrl: "templates/welcome.html"
    })

    .state('start.settings', {
      url: "/settings",
      templateUrl: "templates/settings.html"
    })

    .state('start.register', {
      url: "/register",
      templateUrl: "templates/register.html",
      controller: 'RegisterCtrl'
    })

    .state('start.login', {
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

    .state('wallet', {
      url: "/wallet",
      abstract: true,
      templateUrl: "templates/menu2.html"
    })

    .state('wallet.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    .state('wallet.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile.html",
          controller: 'ProfileCtrl'
        }
      }
    });

    // .state('wallet.home', {
    //   url: "/wallet/home",
    //   views: {
    //     'home-tab' :{
    //       templateUrl: "templates/home.html",
    //       controller: 'HomeCtrl'
    //     }
    //   }
    // })

    // .state('wallet.receive', {
    //   url: "/wallet/receive",
    //   views: {
    //     'receive-tab' :{
    //       templateUrl: "templates/receive.html",
    //       controller: 'ReceiveCtrl'
    //     }
    //   }
    // })

    // .state('wallet.send', {
    //   url: "/wallet/send",
    //   views: {
    //     'send-tab' :{
    //       templateUrl: "templates/send.html",
    //       controller: 'SendCtrl'
    //     }
    //   }
    // })

    // .state('wallet.history', {
    //   url: "/wallet/history",
    //   views: {
    //     'history-tab' :{
    //       templateUrl: "templates/history.html",
    //       controller: 'HistoryCtrl'
    //     }
    //   }
    // })

  $urlRouterProvider.otherwise('/');
});

