angular.module('app.controllers', [])

  .controller('homeCtrl', ['$scope', '$state', '$stateParams', '$rootScope', '$cordovaLaunchNavigator', '$ionicPlatform', 'userService', '$cordovaGeolocation',
    function ($scope, $state, $stateParams, $rootScope, $cordovaLaunchNavigator, $ionicPlatform, userService, $cordovaGeolocation) {
      firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
          userService.user = user;
          $scope.currUser = userService.user;
          $scope.state = 1;
          $scope.updateStatus = (id) => {
            $scope.state = !id;
            let countRef = firebase.database().ref(`drivers/${userService.user.uid}/status`);
            countRef.transaction(function (current_value) {
              return id;
            });
            let firebaseRef = firebase.database().ref(`geoLoc/${id}`);
            let geoFire = new GeoFire(firebaseRef);
            let firebaseRef1 = firebase.database().ref(`geoLoc/${id == 1 ? 0 : 1}`);
            let geoFire1 = new GeoFire(firebaseRef1);
            var posOptions = {timeout: 15000, enableHighAccuracy: false};
            $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var username = userService.user.uid;
                geoFire1.get(username).then(function (location) {
                  if (location !== null) {
                    geoFire1.remove(username)
                  }
                }, function (error) {
                  console.log("Error: " + error);
                });
                geoFire.set(username, [latitude, longitude]).then(function () {
                  console.log("Updated");
                }).catch(function (error) {
                  console.log("Error adding user " + username + "'s location to GeoFire");
                });
              }, function (err) {
                console.log(err)
              });
          };

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
        } else {
          $state.go('login');
        }
      });


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
        };

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

  .controller('profileCtrl', ['$scope', '$stateParams', '$rootScope', 'userService', '$state',
    function ($scope, $stateParams, $rootScope, userService, $state) {
      $scope.currUser = userService.user;
      $scope.logout = () => {
        firebase.auth().signOut().then(() => {
          $scope.currUser = undefined;
          $state.go('login');
          userService.user = undefined;
        }, (error) => {
          console.log(error);
        })
      };
    }])
  .controller('loginCtrl', ['$scope', '$stateParams', '$state', 'userService',
    function ($scope, $stateParams, $state, userService) {
      $scope.user = {};
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          userService.user = user;
          $state.go('tabsController.home');
        }
      });

      $scope.login = () => {
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function (error) {
          console.log(error);
        });

      }
    }]);
