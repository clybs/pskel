const models = require('../models/');
const utils = require('../utils/');

// const Player = models.Player;
const User = models.User;
const UtilPasswords = new utils.Passwords();
const UtilResults = new utils.Results();

class Login {
  // Authenticate a user
  async Authenticate(req) {
    const reqBody = req.body;
    const { email, password } = reqBody;

    let result;

    // Try searching for the email
    try {
      result = await User.findOne({ email });
    } catch (err) {
      // Error occurred
      return UtilResults.EncodeError(err.message, 404);
    }

    // Check if user found
    if (result === null) {
      return UtilResults.EncodeError('User not found', 401);
    }

    // Check if password is a match
    if (!UtilPasswords.SamePasswordHash(password, result.password)) {
      return UtilResults.EncodeError('Password incorrect', 401);
    }

    // Create the token
    let token = UtilPasswords.CreateToken(result.id);

    // Return the result
    return UtilResults.EncodeSuccessUserToken(result, token, 200);
  }
}

module.exports = Login;
