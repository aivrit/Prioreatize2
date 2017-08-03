(function () {
  'use strict';

  angular
    .module('packageps')
    .controller('PackagepsListController', PackagepsListController);

  PackagepsListController.$inject = ['$scope', '$window', 'PackagepsService', 'Authentication'];

  function PackagepsListController($scope, $window,  PackagepsService, Authentication) {
    var vm = this;

    vm.packageps = PackagepsService.query();

    $scope.edit = function edit(id) {
      window.location.href = '/packageps/' + id + '/edit';
    };
    $scope.delete = function del(id) {
      if ($window.confirm('Are you sure you want to delete the package?')) {
        $.ajax({
          url: '/api/packageps/' + id,
          type: 'DELETE',
          data: JSON.stringify({ "id": id }),
          contentType:'application/json',
          dataType: 'json',
          success: function(result) {
            $( "#" + id ).remove();
            },
          error: function(result){
            alert("There was an error deleting the package.");
          }
        });
      }    };
    $scope.userfilter = function userfilter(item) {
      if (item.hasOwnProperty('userr')){
        if (!Authentication.user) {
          return false;
        }
        if (item.userr !== Authentication.user.username) {
          return false;
        }
        return true;
      }
      return false;
    };
  }
}());
