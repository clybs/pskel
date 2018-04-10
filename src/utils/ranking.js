class Ranking {
  // Find players that should be adjusted.
  adjustRating(currentRating, ratingsPoint, totalWins, totalLoses, matches) {
    // PASS1: The first tier is for players with a net "ratings point" gain between 50 and 74 points
    if (ratingsPoint >= 50 && ratingsPoint <= 74) {
      return currentRating + ratingsPoint;
    }

    // PASS2: The second tier is used only for those rated players who have experienced a rating change
    // of at least 75 for a particular tournament.
    if (ratingsPoint >= 75) {
      // If a player has either, all wins, or all losses, the Adjusted Rating is derived by taking the
      // median implied rating for all of the player’s games.
      if (totalWins === 0 || totalLoses === 0) {
        // let summary = matches.map(data => data.opponentsRatingBefore + data.gain)
      }
    }

    // No adjustments needed
    return currentRating;
  }

  // Calculate new rank
  Calculate(currentRank, enemyRank, winner) {
    const rankingChart = [
      { pointSpread: {min: 0, max: 12}, expectedResult: 8, upsetResult: 8},
      { pointSpread: {min: 13, max: 37}, expectedResult: 7, upsetResult: 10},
      { pointSpread: {min: 38, max: 62}, expectedResult: 6, upsetResult: 13},
      { pointSpread: {min: 63, max: 87}, expectedResult: 5, upsetResult: 16},
      { pointSpread: {min: 88, max: 112}, expectedResult: 4, upsetResult: 20},
      { pointSpread: {min: 113, max: 137}, expectedResult: 3, upsetResult: 25},
      { pointSpread: {min: 138, max: 162}, expectedResult: 2, upsetResult: 30},
      { pointSpread: {min: 163, max: 187}, expectedResult: 2, upsetResult: 35},
      { pointSpread: {min: 188, max: 212}, expectedResult: 1, upsetResult: 40},
      { pointSpread: {min: 213, max: 237}, expectedResult: 1, upsetResult: 45},
      { pointSpread: {min: 238, max: 999999}, expectedResult: 0, upsetResult: 50}
    ];

    // TODO: Use the different steps described in https://www.teamusa.org/usa-table-tennis/ratings/rating-system

  }
}

module.exports = Ranking;
