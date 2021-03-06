const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');

const Player = new controllers.Player();

// Create a player
router.post('/', async (req, res, next) => {
  let result = await Player.Create(req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// List players
router.get('/', async (req, res, next) => {
  let result = await Player.List(req.authData.created_by);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Read a player
router.get('/:id', async (req, res, next) => {
  let result = await Player.Read(req.params.id);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Update a player
router.put('/:id', async (req, res, next) => {
  let result = await Player.Update(req.params.id, req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Delete a player
router.delete('/:id', async (req, res, next) => {
  let result = await Player.Delete(req.params.id, req.authData.created_by);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

module.exports = router;
