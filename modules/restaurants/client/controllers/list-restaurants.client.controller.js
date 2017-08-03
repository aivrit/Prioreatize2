(function () {
  'use strict';

  angular
    .module('restaurants')
    .controller('RestaurantsListController', RestaurantsListController);

  RestaurantsListController.$inject = ['RestaurantsService', 'D3sService', '$scope', '$route', '$routeParams', '$location', 'orderByFilter'];

  function RestaurantsListController(RestaurantsService, D3sService, $scope, $route, $routeParams, $location, orderBy) {
    var vm = this;
    var params = $routeParams;
    vm.params = params;
    var alt = $location.search();
    $scope.dataHasLoaded = false;
    $scope.listHasLoaded = false;
    $scope.barData = [];
    $scope.pieData = [];        // { label: 'state', value: count }
    $scope.statistics = '1';
    vm.restaurants = RestaurantsService.query(alt, function() {
      $scope.listHasLoaded = true;
      // Bar Graph data by restaurants review count
      var reverseSort = true;
      $scope.barData = orderBy(vm.restaurants, 'review_count', reverseSort).slice(0, 10);
      // Donut Graph data by state
      var states = [];
      vm.restaurants.forEach(function(r) {
        if (r.state in states) {
          $scope.pieData.find(function(t) { return t.label == r.state; }).value ++;
        } else {
          states[r.state] = 1;
          $scope.pieData.push({ label: r.state, value: 1 });
        }
      });
      // Group all states with small count into Other
      if (vm.restaurants.length > 50) {
        var tmp = $scope.pieData.slice();
        var distFactor = 0;
        $scope.pieData.length > 10 ? distFactor = 10 : distFactor = 6;
        $scope.pieData.push({ label: 'Other', value: 0 });
        tmp.forEach(function (s) {
          if (s.value < distFactor) {
            $scope.pieData.find(function (t) {
              return t.label == 'Other';
            }).value += s.value;
            $scope.pieData.splice($scope.pieData.indexOf(s), 1);
          }
        });
      }
      $scope.dataHasLoaded = true;
    });
  }
}());
