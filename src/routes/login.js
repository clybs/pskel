var express = require('express');
var router = express.Router();

// GET login
router.get('/', function(req, res, next) {
  res.send('login route');
});

module.exports = router;
