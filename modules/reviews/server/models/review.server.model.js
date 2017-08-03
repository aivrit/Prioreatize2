'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Review Schema
 */
var ReviewSchema = new Schema({
  _id: {
    type: Schema.ObjectId
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Review name',
    trim: true
  },
  date: {
    type: String
  },
  business_id: {
    type: String
  },
  text: {
    type: String
  },
  stars: {
    type: Number
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Review', ReviewSchema);
