(function () {
  'use strict';

  angular
    .module('packageps')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Packages',
      state: 'Packages',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'Packages', {
      title: 'Edit my Packages',
      state: 'packageps.list'
    });
  }
}());
