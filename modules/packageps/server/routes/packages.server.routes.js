'use strict';

/**
 * Module dependencies
 */
var packagepsPolicy = require('../policies/packageps.server.policy'),
  packageps = require('../controllers/packageps.server.controller');

module.exports = function(app) {
  // Packageps Routes
  app.route('/api/packageps').all(packagepsPolicy.isAllowed)
    .get(packageps.list)
    .post(packageps.create);

  app.route('/api/packageps/:packagepId').all(packagepsPolicy.isAllowed)
    .get(packageps.read)
    .put(packageps.update)
    .delete(packageps.delete);

  // Finish by binding the Packagep middleware
  app.param('packagepId', packageps.packagepByID);
};
