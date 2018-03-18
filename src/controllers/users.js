const models = require('../models/');
const utils = require('../utils/');

const User = models.User;
const UtilPasswords = new utils.Passwords();
const UtilResults = new utils.Results();

class Users {
  // Create a user
  async Create(req) {
    const reqBody = req.body;
    const user = User(reqBody);
    const { password, confirm_password } = reqBody;

    let result;

    // Check if passwords are not the same
    if (!UtilPasswords.SamePasswords(password, confirm_password)) {
      return UtilResults.EncodeError('Passwords don\'t match', 409);
    }

    // Hash the password
    user.password = UtilPasswords.GetHashedPassword(password);

    // Try saving data
    try {
      result = await user.save();
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 409);
    }

    // Create the token
    let token = UtilPasswords.CreateToken(result.id);

    // Return the result
    return UtilResults.EncodeSuccessUserToken(result, token, 201);
  }

  // List users
  async List() {
    let result;

    // Try listing all data
    try {
      result = await User.find({});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Return the results
    return UtilResults.EncodeSuccessUserList(result, 200);
  }

  // Read a user
  async Read(id) {
    let result;

    // Try reading a data
    try {
      result = await User.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    return UtilResults.EncodeSuccessUser(result, 200);
  }

  // Update a user
  async Update(id, req) {
    const reqBody = req.body;
    const user = User(reqBody);
    const { old_password, password, confirm_password } = reqBody;

    let result;

    // Try reading a data
    try {
      result = await User.findById(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Check if there is a need to update the password
    if (old_password && password && confirm_password) {
      // Check if new passwords are not the same
      if (!UtilPasswords.SamePasswords(password, confirm_password)) {
        return UtilResults.EncodeError('Passwords don\'t match', 422);
      }

      // Check if old password matches the one in db
      if (!UtilPasswords.SamePasswords(result.password, UtilPasswords.GetHashedPassword(old_password))) {
        return UtilResults.EncodeError('Password don\'t match old password', 422);
      }

      // Hash the password new password
      user.password = UtilPasswords.GetHashedPassword(password);
    }

    // Try updating data
    try {
      let userUpdate = user.toObject();
      delete userUpdate._id;
      result = await User.findByIdAndUpdate(id, userUpdate, {new: true});
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 409);
    }

    // Return the result
    return UtilResults.EncodeSuccessUser(result, 200);
  }

  // Delete a user
  async Delete(id) {
    // Try deleting data
    try {
      await User.findByIdAndRemove(id);
    } catch (err) {
      // Error occured
      return UtilResults.EncodeError(err.message, 404);
    }

    // Return the result
    return { success: true, status: 200 };
  }
}

module.exports = Users;
