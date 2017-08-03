// Packageps service used to communicate Packageps REST endpoints
(function () {
  'use strict';

  angular
    .module('packageps')
    .factory('PackagepsService', PackagepsService);

  PackagepsService.$inject = ['$resource'];

  function PackagepsService($resource) {
    return $resource('/api/packageps/:packagepId', {
      packagepId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
