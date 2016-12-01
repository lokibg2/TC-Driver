angular.module('app.controllers', [])

  .controller('homeCtrl', ['$scope', '$stateParams', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $rootScope) {

      $rootScope.currUser = {
        displayName: "Drake Ramoray",
        photoURL: 'http://www.thehindu.com/multimedia/dynamic/01455/DE12_0_05_DEL_JPG_1455362f.jpg',
        type: 'Ambulance',
        email: 'drake@gmail.com',
        phone: '9566233345'
      }
    }])

  .controller('mapCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicLoading', '$cordovaGeolocation', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $rootScope, $ionicLoading, $cordovaGeolocation) {
      var options = {timeout: 10000, enableHighAccuracy: true};

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude + 0.001, position.coords.longitude + 0.001);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {

          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: '../img/truck-lighting.png'
          });

          var infoWindow = new google.maps.InfoWindow({
            content: "You are here!"
          });

          google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
          });
          latLng1 = new google.maps.LatLng(position.coords.latitude + 0.005, position.coords.longitude + 0.005);
          marker2 = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng1,
            icon: '../img/smiley_sad.png'
          });
          infoWindow1 = new google.maps.InfoWindow({
            content: "Road Accident here!!"
          });

          google.maps.event.addListener(marker2, 'click', function () {
            infoWindow1.open($scope.map, marker2);
          });

        });

      }, function (error) {
        console.log("Could not get location");
      });


    }])

  .controller('profileCtrl', ['$scope', '$stateParams', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $rootScope) {

    }]);
