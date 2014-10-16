// Copay App

angular.module('copay', [
  'ionic',
  'monospaced.qrcode',
  'yaru22.angular-timeago',

  'copay.controllers',
  'copay.services',
  'copay.directives',
  'copay.filters'
])

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
      controller: 'LoginCtrl'
    })

    .state('setPin', {
      templateUrl: "templates/pin.html",
      controller: 'SetPinCtrl',
      params: ['email', 'password']
    })

    .state('pin', {
      url: "/pin",
      templateUrl: "templates/pin.html",
      controller: 'PinCtrl'
    })

    .state('profile', {
      url: "/profile",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'SidebarCtrl',
      data: { auth: true }
    })

    .state('profile.wallet', {
      url: "/wallet/:walletId",
      views: {
        'content' :{
          templateUrl: "templates/tabs.html",
          controller: 'WalletCtrl'
        }
      }
    })

    .state('profile.wallet.home', {
      url: "/home",
      views: {
        'tab1' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('profile.wallet.receive', {
      url: "/receive",
      views: {
        'tab2' :{
          templateUrl: "templates/receive.html",
          controller: "ReceiveCtrl"
        }
      }
    })

    .state('profile.wallet.invoice', {
      url: "/invoice",
      views: {
        'tab2' :{
          templateUrl: "templates/invoice.html"
        }
      }
    })

    .state('profile.wallet.send', {
      url: "/send",
      views: {
        'tab3' :{
          templateUrl: "templates/send.html"
        }
      }
    })

  .state('profile.wallet.proposal', {
      url: "/proposal",
      views: {
        'tab3' :{
          templateUrl: "templates/proposal.html"
        }
      }
    })

    .state('profile.wallet.history', {
      url: "/history",
      views: {
        'tab4' :{
          templateUrl: "templates/history.html",
          controller: 'HistoryCtrl'
        }
      }
    })

    .state('profile.edit', {
      url: "/edit",
      views: {
        'content' :{
          templateUrl: "templates/profile.html"
        }
      }
    })

    .state('profile.add', {
      url: "/add",
      views: {
        'content' :{
          templateUrl: "templates/add.html",
          controller: 'AddCtrl'
        }
      }
    })

    .state('profile.payment', {
      url: "/payment",
      views: {
        'content' :{
          templateUrl: "templates/paypro.html"
        }
      }
    })

  $urlRouterProvider.otherwise('/');
})


.run(['$rootScope', '$state', 'Session', function ($rootScope, $state, Session) {

  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

    // Redirect to PIN screen
    if (!Session.isLogged() && Session.hasCredentials() && toState.name != 'pin') {
      event.preventDefault();
      return $state.go('pin');
    }

    // If not logged redirect to home
    var isPrivate = !!(toState.data && toState.data.auth);
    if (!Session.isLogged() && !Session.hasCredentials() && isPrivate) {
      event.preventDefault();
      return $state.go('start.welcome');
    }

    //toState.data && toState.data.auth
    //event.preventDefault();
    //$state.go('user.home');
  });

}]);
