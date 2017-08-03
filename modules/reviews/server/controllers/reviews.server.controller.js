'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Review = mongoose.model('Review'),
  Restaurant = mongoose.model('Restaurant'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Review
 */
exports.create = function(req, res) {
  var review = new Review(req.body);
  review.user = req.user;

  review.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(review);
    }
  });
};

/**
 * Show the current Review
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var review = req.review ? req.review.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  review.isCurrentUserOwner = req.user && review.user && review.user._id.toString() === req.user._id.toString();

  res.jsonp(review);
};

/**
 * Update a Review
 */
exports.update = function(req, res) {
  var review = req.review;

  review = _.extend(review, req.body);

  review.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(review);
    }
  });
};

/**
 * Delete an Review
 */
exports.delete = function(req, res) {
  var review = req.review;

  review.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(review);
    }
  });
};

/**
 * Group reviews By star rating
 */
exports.group = function(req, res) {
  var restaurant_id = req.query.id;
  Restaurant.findById(restaurant_id).exec(function (err, restaurant) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var restaurant_business_id = restaurant._doc.business_id;
      Review.aggregate([
        {
          $match: { 'business_id': restaurant_business_id } }, { $group: { _id: '$stars', count: { $sum: 1 } } }], function(err, reviews) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(reviews);
        }
      });
    }
  });
};

/**
 * List of Reviews
 */
exports.list = function(req, res) {
  var restaurant_id = req.query.id;
  Restaurant.findById(restaurant_id).exec(function (err, restaurant) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var restaurant_business_id = restaurant._doc.business_id;
      Review.find({ 'business_id': restaurant_business_id }).exec(function (err, reviews) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(reviews);
        }
      });
    }
  });
};

/**
 * Review middleware
 */
exports.reviewByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Review is invalid'
    });
  }

  Review.findById(id).populate('user', 'displayName').exec(function (err, review) {
    if (err) {
      return next(err);
    } else if (!review) {
      return res.status(404).send({
        message: 'No Review with that identifier has been found'
      });
    }
    req.review = review;
    next();
  });
};
