(function () {
  'use strict';

  angular
    .module('reviews')
    .controller('ReviewsListController', ReviewsListController);

  ReviewsListController.$inject = ['ReviewsService', '$routeParams'];

  function ReviewsListController(ReviewsService, $routeParams) {
    var vm = this;
    vm.reviews = ReviewsService.query($routeParams);
  }
}());
