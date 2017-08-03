(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['CategoriesService', 'PackagepsService', '$scope', 'Authentication', 'Socket'];

  function HomeController(CategoriesService, PackagepsService, $scope, Authentication, Socket) {
    var vm = this;
    vm.io = Socket;
    vm.packages = PackagepsService.query();
    vm.categories = CategoriesService.query();
    $scope.choosePackage = function choosePackage(pkg) {
      for (var i = 0; i < pkg.priorities.length; i++) {
        var priorities = pkg.priorities[i];
        for (var category in priorities) {
          Reflect.set(vm, category, priorities[category]);
          document.getElementById(category + priorities[category]).parentElement.className += " active";
          for (var j = 0; j < 3; j++) {
            if (j != priorities[category]) {
              document.getElementById((category + j)).parentElement.classList.remove("active");
            }
          }
        }
      }
    };

    $scope.userfilter = function userfilter(item) {
      if (item.hasOwnProperty('userr')){
        if (!Authentication.user) {
          return false;
        }
        if (item.userr !== Authentication.user.username) {
          return false;
        }
      }
      return true;
    };

    $scope.emitClick = function emitClick(){
      vm.io.emit('rest', 'click');
    };
    vm.io.on('win', function(data) {window.location.href = "/restaurants/" + data;});


    $scope.changeRadio = function changeRadio(id) {
        document.getElementById(id).parentElement.className += " active";
        for (var i = 0; i < 3; i++) {
          if ((id.substring(0, id.length - 1) + i) != id) {
            document.getElementById((id.substring(0, id.length - 1) + i)).parentElement.classList.remove("active");
          }
        }
    };
  }

}());
