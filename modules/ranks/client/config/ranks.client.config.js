(function () {
  'use strict';

  angular
    .module('ranks')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

  }
}());
