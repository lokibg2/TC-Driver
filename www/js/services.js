angular.module('app.services', [])


  .service('userService', [function () {
    userService.user = {
      displayName: "Drake Ramoray",
      photoURL: 'http://www.thehindu.com/multimedia/dynamic/01455/DE12_0_05_DEL_JPG_1455362f.jpg',
      type: 'Ambulance',
      email: 'drake@gmail.com',
      phone: '9566233345'
    };
  }]);
