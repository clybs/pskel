const express = require('express');
const router = express.Router();

// GET home page
router.get('/', async (req, res, next) => {
  res.json(await 'index route');
});

module.exports = router;
