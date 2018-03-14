var express = require('express');
var router = express.Router();

// GET players
router.get('/', function(req, res, next) {
  res.send('players route');
});

module.exports = router;
