const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchesSchema = new Schema({
  player_one: {
    type: String,
    required: true
  },
  player_one_score: {
    type: Number,
    min: 0,
    required: true
  },
  player_two: {
    type: String,
    required: true
  },
  player_two_score: {
    type: Number,
    min: 0,
    required: true
  },
  winner: {
    type: String,
    required: true
  },
  loser: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
},
{
  timestamps: true,
  versionKey: false
});

const Matches = mongoose.model('Matches', MatchesSchema);

module.exports = Matches;
