class Results {
  getMatchDetails(data, data_one, data_two, data_winner, data_loser) {
    let player_one = this.getPlayerDetails(data_one);
    let player_two = this.getPlayerDetails(data_two);
    let player_winner = this.getPlayerDetails(data_winner);
    let player_loser = this.getPlayerDetails(data_loser);

    return {
      id: data._id,
      player_one: player_one.last_name + ', ' + player_one.first_name,
      player_one_score: data.player_one_score,
      player_two: player_two.last_name + ', ' + player_two.first_name,
      player_two_score: data.player_two_score,
      winner: player_winner.last_name + ', ' + player_winner.first_name,
      loser: player_loser.last_name + ', ' + player_loser.first_name
    };
  }

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
  EncodeSuccessMatch(result, result_one, result_two, result_winner, result_loser, statusCode) {
    return {
      success: true,
      status: statusCode,
      match: this.getMatchDetails(result, result_one, result_two, result_winner, result_loser)
    };
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
  EncodeSuccessMatchList(results, statusCode) {
    return {
      success: true,
      status: statusCode,
      matches: results
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
