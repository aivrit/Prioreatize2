(function () {
  'use strict';

  // Restaurants controller
  angular
    .module('restaurants')
    .controller('RestaurantsController', RestaurantsController);

  RestaurantsController.$inject = ['ReviewsService', 'D3sService', '$scope', '$location', '$state', '$window', 'Authentication', 'restaurantResolve', 'orderByFilter'];

  function RestaurantsController (ReviewsService, D3sService, $scope, $location, $state, $window, Authentication, restaurant, orderBy) {
    var vm = this;
    vm.authentication = Authentication;
    vm.restaurant = restaurant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.getrange = function(n) {
      var count = [];
      for (var i = 0; i < n; i++) {
        count.push(i);
      }
      return count;
    };

    $scope.dataLoaded = false;
    $scope.reviewsGroupByStars = [];
    vm.reviews = ReviewsService.getReviews().query({ id: restaurant._id });
    vm.reviewsGroupByStars = ReviewsService.getReviewsGroupByStars().query({ id: restaurant._id }, function () {
      var reverseSort = true;
      $scope.reviewsGroupByStars = orderBy(vm.reviewsGroupByStars, '_id', reverseSort);
      $scope.dataLoaded = true;
    });

    // Remove existing Restaurant
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.restaurant.$remove($state.go('restaurants.list'));
      }
    }

    // Save Restaurant
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.restaurantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.restaurant._id) {
        vm.restaurant.$update(successCallback, errorCallback);
      } else {
        vm.restaurant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('restaurants.view', {
          restaurantId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }

  angular.module('restaurants').filter('round', function () {
    return function (num) {
      return Math.round(num);
    };
  });

  angular.module('restaurants').filter('floor', function () {
    return function (num) {
      return Math.floor(num);
    };
  });

  angular.module('restaurants').filter('modulu', function () {
    return function (num) {
      return num % 1 !== 0 ? 1 : 0;
    };
  });
}());
