(function () {
  'use strict';

  angular
    .module('packageps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('packageps', {
        abstract: true,
        url: '/packageps',
        template: '<ui-view/>'
      })
      .state('packageps.list', {
        url: '',
        templateUrl: '/modules/packageps/client/views/list-packageps.client.view.html',
        controller: 'PackagepsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Packageps List'
        }
      })
      .state('packageps.create', {
        url: '/create',
        templateUrl: '/modules/packageps/client/views/form-packagep.client.view.html',
        controller: 'PackagepsController',
        controllerAs: 'vm',
        resolve: {
          packagepResolve: newPackagep
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Packageps Create'
        }
      })
      .state('packageps.edit', {
        url: '/:packagepId/edit',
        templateUrl: '/modules/packageps/client/views/form-packagep.client.view.html',
        controller: 'PackagepsController',
        controllerAs: 'vm',
        resolve: {
          packagepResolve: getPackagep
        },
        data: {
          pageTitle: 'Edit Packagep {{ packagepResolve.name }}'
        }
      })
      .state('packageps.view', {
        url: '/:packagepId',
        templateUrl: '/modules/packageps/client/views/view-packagep.client.view.html',
        controller: 'PackagepsController',
        controllerAs: 'vm',
        resolve: {
          packagepResolve: getPackagep
        },
        data: {
          pageTitle: 'Packagep {{ packagepResolve.name }}'
        }
      });
  }

  getPackagep.$inject = ['$stateParams', 'PackagepsService'];

  function getPackagep($stateParams, PackagepsService) {
    return PackagepsService.get({
      packagepId: $stateParams.packagepId
    }).$promise;
  }

  newPackagep.$inject = ['PackagepsService'];

  function newPackagep(PackagepsService) {
    return new PackagepsService();
  }
}());
