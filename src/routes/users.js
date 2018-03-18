const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');

const User = new controllers.User();

// Create a user
router.post('/', async (req, res, next) => {
  let result = await User.Create(req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// List users
router.get('/', async (req, res, next) => {
  let result = await User.List();
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Read a user
router.get('/:id', async (req, res, next) => {
  let result = await User.Read(req.params.id);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Update a user
router.put('/:id', async (req, res, next) => {
  let result = await User.Update(req.params.id, req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

// Delete a user
router.delete('/:id', async (req, res, next) => {
  let result = await User.Delete(req.params.id);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

module.exports = router;
