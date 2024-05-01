const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');
const passport = require('../utils/passport-configs');
// Rota de registro
router.post('/register',registerUser);

module.exports = router;
