(function () {
  'use strict';

  angular
    .module('ranks')
    .controller('RanksListController', RanksListController);

  RanksListController.$inject = ['RanksService'];

  function RanksListController(RanksService) {
    var vm = this;

    vm.ranks = RanksService.query();
  }
}());
