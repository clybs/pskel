const _ = require('lodash');
const models = require('../models/');
const utils = require('../utils/');

const Match = models.Match;
const Player = models.Player;
const UtilResults = new utils.Results();
const UtilMatches = new utils.Matches();

// Errors
const ERROR_SAME_PLAYER = 'Same players';
const ERROR_PLAYER_NOT_FOUND = 'Player not found';
const ERROR_PLAYERS_FROM_SAME_CREATOR = 'Players came from same creator';
const ERROR_WINNER_NOT_VALID = 'Winner not valid';
const ERROR_LOSER_NOT_VALID = 'Loser not valid';
const ERROR_REQUIRED_PARAMETER_MISSING = 'Required parameter missing';
const ERROR_WINNER_AND_LOSER_SHOULD_BE_DIFFERENT_PLAYERS = 'Winner and loser should be different players';

class Matches {
  // Create a match
  async Create(req) {
    const reqBody = req.body;
    const match = Match(reqBody);

    let result, result_one, result_two;

    // Make sure required params are present
    let requiredParams = [
      match.player_one,
      match.player_two,
      match.winner,
      match.loser,
      match.player_one_score,
      match.player_two_score
    ];

    let missingParameter = false;
    // let parameterMissing = '';

    requiredParams.map(data => {
      if (_.isUndefined(data) || _.isNil(data)) {
        missingParameter = true;
      }
    });

    // Check if missing parameter found
    if (missingParameter) {
      return UtilResults.EncodeError(ERROR_REQUIRED_PARAMETER_MISSING, 409);
    }

    // Try finding player one id
    try {
      result_one = await Player.findById(match.player_one);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Try finding player two id
    try {
      result_two = await Player.findById(match.player_two);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Check if player one and player two are the same
    if (match.player_one === match.player_two) {
      return UtilResults.EncodeError(ERROR_SAME_PLAYER, 409);
    }

    // Check if player creators are the same
    if (result_one.created_by === result_two.created_by) {
      return UtilResults.EncodeError(ERROR_PLAYERS_FROM_SAME_CREATOR, 409);
    }

    // Check if winner is valid
    if (match.winner !== match.player_one && match.winner !== match.player_two) {
      return UtilResults.EncodeError(ERROR_WINNER_NOT_VALID, 409);
    }

    // Check if loser id is valid
    if (match.loser !== match.player_one && match.loser !== match.player_two) {
      return UtilResults.EncodeError(ERROR_LOSER_NOT_VALID, 409);
    }

    // Check if winner id and loser id are different
    if (match.winner === match.loser) {
      return UtilResults.EncodeError(ERROR_WINNER_AND_LOSER_SHOULD_BE_DIFFERENT_PLAYERS, 409);
    }

    // Attach match data
    match.created_by = req.authData.created_by;

    // Try saving data
    try {
      result = await match.save();
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 409);
    }

    // Get winner and loser details
    const {result_winner, result_loser} = UtilMatches.GetWinnerLoser(result, result_one, result_two);

    // Return the result
    return UtilResults.EncodeSuccessMatch(result, result_one, result_two, result_winner, result_loser, 201);
  }

  // List matches
  async List() {
    let result, formattedResults;

    // Try listing all data
    try {
      result = await Match.find({});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Get the formatted equivalent
    formattedResults = await Promise.all(result.map(async data => await this.Read(data._id)));


    // Drop the unused details
    formattedResults = formattedResults.map(data => data.match);

    // Return the results
    return UtilResults.EncodeSuccessMatchList(formattedResults, 200);
  }

  // Read a match
  async Read(id) {
    let result, result_one, result_two;

    // Try reading a data
    try {
      result = await Match.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Try finding player one id
    try {
      result_one = await Player.findById(result.player_one);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Try finding player two id
    try {
      result_two = await Player.findById(result.player_two);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Get winner and loser details
    const {result_winner, result_loser} = UtilMatches.GetWinnerLoser(result, result_one, result_two);

    // Return the result
    return UtilResults.EncodeSuccessMatch(result, result_one, result_two, result_winner, result_loser, 200);
  }

  // Update a match
  async Update(id, req) {
    const reqBody = req.body;
    const match = Match(reqBody);

    let result, result_one, result_two;

    // Try reading a data
    try {
      result = await Match.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Try updating data
    try {
      let matchUpdate = match.toObject();
      delete matchUpdate._id;
      result = await Match.findByIdAndUpdate(id, matchUpdate, {new: true});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 409);
    }

    // Try finding player one id
    try {
      result_one = await Player.findById(result.player_one);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Try finding player two id
    try {
      result_two = await Player.findById(result.player_two);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(ERROR_PLAYER_NOT_FOUND, 404);
    }

    // Get winner and loser details
    const {result_winner, result_loser} = UtilMatches.GetWinnerLoser(result, result_one, result_two);

    // Return the result
    return UtilResults.EncodeSuccessMatch(result, result_one, result_two, result_winner, result_loser, 200);
  }

  // Delete a match
  async Delete(id, created_by) {
    let result;

    // Try reading a data
    try {
      result = await Match.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Check if created_by are a match
    if (result.created_by !== created_by) {
      return UtilResults.EncodeError('Match not found', 404);
    }

    // Try deleting data
    try {
      await Match.findByIdAndRemove(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Return the result
    return { success: true, status: 200 };
  }
}

module.exports = Matches;
