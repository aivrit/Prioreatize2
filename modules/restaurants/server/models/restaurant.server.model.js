'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Restaurant Schema
 */
var RestaurantSchema = new Schema({
  _id: {
    type: Schema.ObjectId
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Restaurant name',
    trim: true
  },
  romantic: {
    type: String
  },
  qualityscore: {
    type: String
  },
  good_for_meat_rating: {
    type: String
  },
  quality_of_service_score: {
    type: String
  },
  cheap: {
    type: String
  },
  big_dish_score: {
    type: String
  },
  good_for_kids: {
    type: String
  },
  casual: {
    type: String
  },
  upscale: {
    type: String
  },
  noise_level: {
    type: String
  },
  wheelchair: {
    type: String
  },
  fast_score: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Restaurant', RestaurantSchema);
