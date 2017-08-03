// Ranks service used to communicate Ranks REST endpoints
(function () {
  'use strict';

  angular
    .module('ranks')
    .factory('RanksService', RanksService);

  RanksService.$inject = ['$resource'];

  function RanksService($resource) {
    return $resource('api/ranks/:rankId', {
      rankId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
