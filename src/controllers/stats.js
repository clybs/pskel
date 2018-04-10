const _ = require('lodash');
const models = require('../models/');
const utils = require('../utils/');

const Match = models.Match;
const Player = models.Player;
const UtilResults = new utils.Results();

class Stats {
  // List matches
  async List() {
    let result, formattedResults;

    // Try listing all data
    try {
      result = await Player.find({});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Get the formatted equivalent
    formattedResults = await Promise.all(result.map(async data => await this.Read(data._id)));

    // Drop the unused details
    formattedResults = formattedResults.map(data => data.stats);

    // Return the results
    return UtilResults.EncodeSuccessStatsList(formattedResults, 200);
  }

  // Read user stats
  async Read(id) {
    let result;

    // Try reading a data
    try {
      result = await Match.find({$or: [{player_one: id}, {player_two: id}]});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Get player details
    let player = await Player.findById(id);
    let wins = result.filter(data => data.winner === String(id));
    let losses = result.filter(data => data.loser === String(id));

    // Create the summary
    let summary = {
      id,
      first_name: player.first_name,
      last_name: player.last_name,
      wins: wins.length,
      losses: losses.length
    };

    // Return the result
    return UtilResults.EncodeSuccessStats(summary, 201);
  }
}

module.exports = Stats;
