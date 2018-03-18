const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayersSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    required: true
  },
  handedness: {
    type: String,
    enum: [
      'left',
      'right'
    ],
    required: true
  },
  created_by: {
    type: String
  },
  created_at: Date,
  updated_at: Date
},
{
  timestamps: true,
  versionKey: false
});

PlayersSchema.index({ first_name: 1, last_name: 1}, { unique: true });
const Players = mongoose.model('Players', PlayersSchema);

module.exports = Players;
