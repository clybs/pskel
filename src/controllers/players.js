const models = require('../models/');
const utils = require('../utils/');

const Player = models.Player;
const UtilResults = new utils.Results();

class Players {
  // Create a player
  async Create(req) {
    const reqBody = req.body;
    const player = Player(reqBody);

    let result;

    // Attach user data
    player.created_by = req.authData.created_by;

    // Try saving data
    try {
      result = await player.save();
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 409);
    }

    // Return the result
    return UtilResults.EncodeSuccessPlayer(result, 201);
  }

  // List players
  async List(created_by) {
    let result;

    // Try listing all data
    try {
      result = await Player.find({ created_by });
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Return the results
    return UtilResults.EncodeSuccessPlayerList(result, 200);
  }

  // Read a player
  async Read(id) {
    let result;

    // Try reading a data
    try {
      result = await Player.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    return UtilResults.EncodeSuccessPlayer(result, 200);
  }

  // Update a player
  async Update(id, req) {
    const reqBody = req.body;
    const player = Player(reqBody);

    let result;

    // Try reading a data
    try {
      result = await Player.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Try updating data
    try {
      let playerUpdate = player.toObject();
      delete playerUpdate._id;
      result = await Player.findByIdAndUpdate(id, playerUpdate, {new: true});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 409);
    }

    // Return the result
    return UtilResults.EncodeSuccessPlayer(result, 200);
  }

  // Delete a player
  async Delete(id, created_by) {
    let result;

    // Try reading a data
    try {
      result = await Player.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Check if created_by are a match
    if (result.created_by !== created_by) {
      return UtilResults.EncodeError('Player not found', 404);
    }

    // Try deleting data
    try {
      await Player.findByIdAndRemove(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Return the result
    return { success: true, status: 200 };
  }
}

module.exports = Players;
