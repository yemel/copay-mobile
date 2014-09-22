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

    .state('welcome', {
      url: "/",
      templateUrl: "templates/welcome.html",
      // controller: 'WelcomeCtrl'
    })

    .state('settings', {
      url: "/settings",
      templateUrl: "templates/settings.html",
      // controller: 'AppCtrl'
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

    .state('wallet', {
      abstract: true,
      templateUrl: "templates/menu.html",
    })

    .state('wallet.home', {
      url: "/wallet/home",
      views: {
        'home-tab' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    .state('wallet.receive', {
      url: "/wallet/receive",
      views: {
        'receive-tab' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    .state('wallet.send', {
      url: "/wallet/send",
      views: {
        'send-tab' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    .state('wallet.history', {
      url: "/wallet/history",
      views: {
        'history-tab' :{
          templateUrl: "templates/home.html"
        }
      }
    })

    // .state('profile.profile', {
    //   url: "/app",
    //   abstract: true,
    //   templateUrl: "templates/menu.html",
    //   controller: 'AppCtrl'
    // })

    // .state('profile.search', {
    //   url: "/search",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/search.html"
    //     }
    //   }
    // })

    // .state('app.profile.browse', {
    //   url: "/browse",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/browse.html"
    //     }
    //   }
    // })
    // .state('app.profile.playlists', {
    //   url: "/playlists",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/playlists.html",
    //       controller: 'PlaylistsCtrl'
    //     }
    //   }
    // })

    // .state('app.profile.single', {
    //   url: "/playlists/:playlistId",
    //   views: {
    //     'menuContent' :{
    //       templateUrl: "templates/playlist.html",
    //       controller: 'PlaylistCtrl'
    //     }
    //   }
    // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});

