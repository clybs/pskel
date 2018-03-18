class Results {
  getPlayerDetails(data) {
    return {
      id: data._id,
      first_name: data.first_name,
      last_name: data.last_name,
      rating: data.rating,
      handedness: data.handedness
    };
  }

  getUserDetails(data) {
    return {
      id: data._id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email
    };
  }

  // Encode error with status code
  EncodeError(errorMessage, statusCode) {
    return {
      success: false,
      status: statusCode,
      error: errorMessage
    };
  }

  // Encode success user with token
  EncodeSuccessUserToken(result, token, statusCode) {
    let user = this.EncodeSuccessUser(result, statusCode);
    user.token = token;
    return user;
  }

  // Encode success with status code
  EncodeSuccessPlayer(result, statusCode) {
    return {
      success: true,
      status: statusCode,
      player: this.getPlayerDetails(result)
    };
  }

  // Encode success with status code
  EncodeSuccessUser(result, statusCode) {
    return {
      success: true,
      status: statusCode,
      user: this.getUserDetails(result)
    };
  }

  // Encode success list with status code
  EncodeSuccessPlayerList(results, statusCode) {
    return {
      success: true,
      status: statusCode,
      players: results.map(data => this.getPlayerDetails(data))
    };
  }

  // Encode success list with status code
  EncodeSuccessUserList(results, statusCode) {
    return {
      success: true,
      status: statusCode,
      users: results.map(data => this.getUserDetails(data))
    };
  }
}

module.exports = Results;
