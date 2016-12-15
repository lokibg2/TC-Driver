angular.module('app.controllers', [])

  .controller('homeCtrl', ['$scope', '$stateParams', '$rootScope', '$cordovaLaunchNavigator', '$ionicPlatform', 'userService',
    function ($scope, $stateParams, $rootScope, $cordovaLaunchNavigator, $ionicPlatform, userService) {
      $scope.currUser = userService.user;
      $scope.launchNavigator = function () {
        console.log("HELLO!");
        var destination = [13.082, 80.270];
        $ionicPlatform.ready(() => {
          $cordovaLaunchNavigator.navigate(destination, null).then(function () {
            console.log("Navigator launched");
          }, function (err) {
            console.error(err);
          });
        });
      };
    }])

  .controller('mapCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicLoading', 'userService',
    function ($scope, $stateParams, $rootScope, $ionicLoading, userService) {
      document.addEventListener("deviceready", onDeviceReady, false);
      let mymap = L.map('mapid');
      mymap.setView([13.0827, 80.2707], 15);
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9raWJnMiIsImEiOiJjaXdwaHRqNzMwMDE4MnpxZmVvNDY3a2w5In0.Qg9Jtx5Hu5-FuFYyjqfSQg', {
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      }).addTo(mymap);
      let marker = L.marker([13.0827, 80.2707]).addTo(mymap);

      function onDeviceReady() {
        // Get a reference to the plugin.
        var bgGeo = window.BackgroundGeolocation;

        //This callback will be executed every time a geolocation is recorded in the background.
        var callbackFn = function (location, taskId) {
          var coords = location.coords;
          userService.user.lat = coords.latitude;
          userService.user.lng = coords.longitude;

          marker.setLatLng([userService.user.lat, userService.user.lng]).update();
          console.log(userService.user.lat);
          console.log(userService.user.lng);


          // Must signal completion of your callbackFn.
          bgGeo.finish(taskId);
        };

        // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
        var failureFn = function (errorCode) {
          console.warn('- BackgroundGeoLocation error: ', errorCode);
        }

        // Listen to location events & errors.
        bgGeo.on('location', callbackFn, failureFn);

        // Fired whenever state changes from moving->stationary or vice-versa.
        bgGeo.on('motionchange', function (isMoving) {
          console.log('- onMotionChange: ', isMoving);
        });

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure({
          // Geolocation config
          desiredAccuracy: 0,
          distanceFilter: 10,
          stationaryRadius: 50,
          locationUpdateInterval: 100,
          fastestLocationUpdateInterval: 5000,

          // Activity Recognition config
          activityType: 'AutomotiveNavigation',
          activityRecognitionInterval: 5000,
          stopTimeout: 5,

          // Application config
          debug: true,
          stopOnTerminate: false,
          startOnBoot: true,

          // HTTP / SQLite config
          url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
          method: 'POST',
          autoSync: true,
          maxDaysToPersist: 1,
          headers: {
            "X-FOO": "bar"
          },
          params: {
            "auth_token": "maybe_your_server_authenticates_via_token_YES?"
          }
        }, function (state) {
          // This callback is executed when the plugin is ready to use.
          console.log('BackgroundGeolocation ready: ', state);
          if (!state.enabled) {
            bgGeo.start();
          }
        });

        // The plugin is typically toggled with some button on your UI.
        function onToggleEnabled(value) {
          if (value) {
            bgGeo.start();
          } else {
            bgGeo.stop();
          }
        }
      }

    }])

  .controller('profileCtrl', ['$scope', '$stateParams', '$rootScope', 'userService',
    function ($scope, $stateParams, $rootScope, userService) {
      $scope.currUser = userService;
    }]);
