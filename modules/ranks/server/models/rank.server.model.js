'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rank Schema
 */
var RankSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Rank name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Rank', RankSchema);
