const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');

const Match = new controllers.Matches();

// Create a match
router.post('/', async (req, res, next) => {
  let result = await Match.Create(req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// List matches
router.get('/', async (req, res, next) => {
  let result = await Match.List();
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Read a match
router.get('/:id', async (req, res, next) => {
  let result = await Match.Read(req.params.id);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Update a match
router.put('/:id', async (req, res, next) => {
  let result = await Match.Update(req.params.id, req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Delete a match
router.delete('/:id', async (req, res, next) => {
  let result = await Match.Delete(req.params.id, req.authData.created_by);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

module.exports = router;
