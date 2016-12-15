angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


      .state('tabsController.home', {
        url: '/home',
        views: {
          'tab1': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })

      .state('tabsController.map', {
        url: '/map',
        views: {
          'tab2': {
            templateUrl: 'templates/map.html',
            controller: 'mapCtrl'
          }
        }
      })

      .state('tabsController.profile', {
        url: '/profile',
        views: {
          'tab3': {
            templateUrl: 'templates/profile.html',
            controller: 'profileCtrl'
          }
        }
      })

      .state('tabsController', {
        url: '/page1',
        templateUrl: 'templates/tabsController.html',
        abstract: true
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'

      })


    $urlRouterProvider.otherwise('/page1/home');


  });

