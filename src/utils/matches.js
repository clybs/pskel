class Matches {
  // Get winner and loser
  GetWinnerLoser(result, result_one, result_two) {
    if (result.winner === result.player_two) {
      return {
        result_winner: result_two,
        result_loser: result_one
      };
    }
    return {
      result_winner: result_one,
      result_loser: result_two
    };
  }
}

module.exports = Matches;
