const _ = require('lodash');
const models = require('../models/');
const utils = require('../utils/');

const Match = models.Match;
const Player = models.Player;
const UtilResults = new utils.Results();

// Errors
const ERROR_PLAYER_NOT_FOUND = 'Player not found';

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

    if (_.isNull(player)) {
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Create the summary
    let summary = {
      id,
      first_name: player.first_name,
      last_name: player.last_name,
      wins: wins.length,
      losses: losses.length,
      winPercentage: _.round(wins.length / result.length * 100, 2),
      lossPercentage: _.round(losses.length / result.length * 100, 2)
    };

    // Return the result
    return UtilResults.EncodeSuccessStats(summary, 201);
  }
}

module.exports = Stats;
