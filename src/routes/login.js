const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');

const Login = new controllers.Login();

// Authenticate user
router.post('/', async (req, res, next) => {
  let result = await Login.Authenticate(req);
  res.status(result.status);
  delete result.status;

  res.json(result);
});

module.exports = router;
