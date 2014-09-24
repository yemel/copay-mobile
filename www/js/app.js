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
      templateUrl: "templates/menu.html"
    })

    .state('wallet.tabs', {
      url: "/browse",
      views: {
        'content' :{
          templateUrl: "templates/tabs.html"
        }
      }
    })

    .state('wallet.tabs.home', {
      url: "/home",
      views: {
        'tab1' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    .state('wallet.tabs.receive', {
      url: "/receive",
      views: {
        'tab2' :{
          templateUrl: "templates/receive.html"
        }
      }
    })

    .state('wallet.tabs.invoice', {
      url: "/invoice",
      views: {
        'tab2' :{
          templateUrl: "templates/invoice.html"
        }
      }
    })

    .state('wallet.tabs.send', {
      url: "/send",
      views: {
        'tab3' :{
          templateUrl: "templates/send.html"
        }
      }
    })

  .state('wallet.tabs.proposal', {
      url: "/proposal",
      views: {
        'tab3' :{
          templateUrl: "templates/proposal.html"
        }
      }
    })

    .state('wallet.tabs.history', {
      url: "/history",
      views: {
        'tab4' :{
          templateUrl: "templates/history.html"
        }
      }
    })

    .state('wallet.profile', {
      url: "/edit",
      views: {
        'content' :{
          templateUrl: "templates/profile.html"
        }
      }
    })

    .state('wallet.add', {
      url: "/add",
      views: {
        'content' :{
          templateUrl: "templates/add.html"
        }
      }
    })

    .state('wallet.payment', {
      url: "/payment",
      views: {
        'content' :{
          templateUrl: "templates/paypro.html"
        }
      }
    })

  $urlRouterProvider.otherwise('/');
});

