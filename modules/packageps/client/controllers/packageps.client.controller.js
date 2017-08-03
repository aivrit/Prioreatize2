(function () {
  'use strict';

  // Packageps controller
  angular
    .module('packageps')
    .controller('PackagepsController', PackagepsController);

  PackagepsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'packagepResolve'];

  function PackagepsController ($scope, $state, $window, Authentication, packagep) {
    var vm = this;

    vm.authentication = Authentication;
    vm.packagep = packagep;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    // Save Packagep
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.packagepForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.packagep._id) {
        vm.packagep.$update(successCallback, errorCallback);
      } else {
        vm.packagep.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('home', {
          packagepId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
