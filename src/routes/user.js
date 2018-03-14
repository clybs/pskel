var express = require('express');
var router = express.Router();

// GET user
router.get('/', function(req, res, next) {
  res.send('user route');
});

module.exports = router;
