// Restaurants service used to communicate Restaurants REST endpoints
(function () {
  'use strict';

  angular
    .module('core')
    .factory('GoogleMapsService', GoogleMapsService);

  GoogleMapsService.$inject = ['$resource'];

  function GoogleMapsService($resource) {
    return $resource('https://maps.googleapis.com/maps/api/js?key=:API_KEY', {
      API_KEY: 'AIzaSyAz6zrAfFcmWXKc5k5EoeP8hJX_YZUSiRY'
    });
  }

  // GoogleMapsService.$inject = ['$http'];
  //
  // function GoogleMapsService($http) {
  //   return {
  //     initMap: function (data) {
  //       // var Google_API_KEY = 'AIzaSyAz6zrAfFcmWXKc5k5EoeP8hJX_YZUSiRY';
  //       // var api = 'https://maps.googleapis.com/maps/api/js?key=' + Google_API_KEY;
  //       // return $http.get(api)
  //       //   .then(function() {
  //           var uluru = {lat: data.lat, lng: data.lng};
  //           var map = new google.maps.Map(document.getElementById('map'), {
  //             zoom: 4,
  //             center: uluru
  //           });
  //           var marker = new google.maps.Marker({
  //             position: uluru,
  //             map: map
  //           });
  //         // });
  //     }
  //   };
  // }
}());
