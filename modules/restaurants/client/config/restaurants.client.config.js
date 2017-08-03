(function () {
  'use strict';

  angular
    .module('restaurants')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  }
}());
