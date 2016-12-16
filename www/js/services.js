angular.module('app.services', [])


  .service('userService', ['$state', function ($state) {
    let $this = this;
    $this.user = {};
    

    this.user = {
      // displayName: "Drake Ramoray",
      // photoURL: 'http://www.thehindu.com/multimedia/dynamic/01455/DE12_0_05_DEL_JPG_1455362f.jpg',
      // type: 'Ambulance',
      // email: 'drake@gmail.com',
      // phone: '9566233345'
    };
  }]);
