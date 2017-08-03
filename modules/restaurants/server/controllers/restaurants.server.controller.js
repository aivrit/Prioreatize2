

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Restaurant = mongoose.model('Restaurant'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Restaurant
 */
exports.create = function(req, res) {
  var restaurant = new Restaurant(req.body);
  restaurant.user = req.user;

  restaurant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * Show the current Restaurant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var restaurant = req.restaurant ? req.restaurant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  restaurant.isCurrentUserOwner = req.user && restaurant.user && restaurant.user._id.toString() === req.user._id.toString();

  res.jsonp(restaurant);
};

/**
 * Update a Restaurant
 */
exports.update = function(req, res) {
  var restaurant = req.restaurant;

  restaurant = _.extend(restaurant, req.body);

  restaurant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * Delete an Restaurant
 */
exports.delete = function(req, res) {
  var restaurant = req.restaurant;

  restaurant.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * List of Restaurants
 */
exports.list = function(req, res) {
  var name = "";
  var city = "";

  if ("name" in req.query) {
    name = req.query.name;
  }

  if ("city" in req.query) {
    city = req.query.city;
  }

  if (name == "" && city == "") {
    getCategories(req, res);
  }
  else {
    searchByName(req, res, name, city);
  }
};

function searchByName(req, res, name, city) {
  Restaurant.find({ 'name': new RegExp(name, 'i'), 'city': new RegExp(city, 'i') }).limit(100).exec(function(err, restaurants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurants);
    }
  });
}

exports.getRandomId = function getRandomRestaurant() {
  return (Restaurant.find({}).limit(100).exec());
}

function getCategories(req, res) {
  Category.find().limit(100).exec(function(err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      iterateOnParams(req, res, categories);
    }});
}

function iterateOnParams(req, res, categories) {
  var rank_names = [];
  var categories_importance = [];
  for (var categoryName in req.query) {
    if (req.query.hasOwnProperty(categoryName)) {
      // check if it is important or critical
      if (req.query[categoryName] !== "0") {
        // loop on categories and find the right one, then get it's rank name
        for (var i = 0; i < categories.length; i++) {
          if (categories[i].name == categoryName) {
            rank_names.push(categories[i].rank_name);
            categories_importance.push(req.query[categoryName]);
          }
        }
      }
    }
  }
  queryAll(req, res, rank_names, categories_importance);
}

function queryAll(req, res, rank_names, categories_importance) {
  var limit_num = (1000 / rank_names.length);
  var promises = [];
  var joint_results = [];
  for (var i = 0; i < rank_names.length; i++) {
    promises.push(queryOne(rank_names[i], limit_num));
  }
  Promise.all(promises).then( values => {
    for (var j = 0; j < values.length; j++) {
      joint_results = joint_results.concat(values[j]);
  }
  multiplyAndSum(req, res, joint_results, rank_names, categories_importance);
}).catch( reason => {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(reason)
    });
});
}

function multiplyAndSum(req, res, joint_results, rank_names, categories_importance) {
  var restaurant = [];
  var sum = 0;
  for (var i = 0; i < joint_results.length; i++) {
    restaurant = joint_results[i];
    sum = 0;
    for (var j = 0; j < rank_names.length; j++) {
      if (restaurant[rank_names[j]] == undefined) {
        restaurant[rank_names[j]] = 2.5;
      }
      restaurant[rank_names[j]] = restaurant[rank_names[j]] * (1 + (categories_importance[j] / 1));
      sum += parseFloat(restaurant[rank_names[j]]);
    }
    restaurant.sum = sum;
  }
  joint_results = joint_results.sort(function(obj1, obj2) {
    // Desc
    return obj2.sum - obj1.sum;
  });
  joint_results = joint_results.filter((resta, index, self) => self.findIndex((t) => {return t.name == resta.name && t._id.id[0] == resta._id.id[0];}) === index);
  res.jsonp(joint_results.slice(0,100));
}

function queryOne(rank_name, limit_num) {
  return Restaurant.find({'auto_tag': {$exists: true}}).limit(limit_num).sort(`-${rank_name}`).exec();
}

/**
 * List of Restaurants searched
 */
exports.search = function(req, res) {
  Restaurant.find().limit(100).sort('-created').populate('user', 'displayName').exec(function(err, restaurants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurants);
    }
  });
};

/**
 * Restaurant middleware
 */
exports.restaurantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Restaurant is invalid'
    });
  }

  Restaurant.findById(id).populate('user', 'displayName').exec(function (err, restaurant) {
    if (err) {
      return next(err);
    } else if (!restaurant) {
      return res.status(404).send({
        message: 'No Restaurant with that identifier has been found'
      });
    }
    req.restaurant = restaurant;
    next();
  });
};


/**
* Restaurant find by categories
*/
exports.restaurantByCategories = function(req, res, next) {
  Restaurant.find().populate('user', 'displayName').exec(function (err, restaurant) {
    if (err) {
      return next(err);
    } else if (!restaurant) {
      return res.status(404).send({
        message: 'No Restaurant with that identifier has been found'
      });
    }
    req.restaurant = restaurant;
    next();
  });
};
