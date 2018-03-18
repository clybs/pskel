const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');

class Passwords {
  // Create token
  CreateToken(id) {
    // Create the token
    const payload = {
      created_by: id
    };

    let token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: '1h'
    });

    return token;
  }

  // Get the hashed password
  GetHashedPassword(password) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Check if the same passwords
  SamePasswords(password1, password2) {
    return password1 === password2;
  }

  // Check if same hashed password
  SamePasswordHash(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

module.exports = Passwords;
