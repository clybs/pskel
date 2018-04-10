const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');

const Stats = new controllers.Stats();

// List matches
router.get('/', async (req, res, next) => {
  let result = await Stats.List();
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Read a stat
router.get('/:id', async (req, res, next) => {
  let result = await Stats.Read(req.params.id);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

module.exports = router;
