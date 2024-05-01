const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginController');

// Rota de registro
router.post('/login', loginUser);

module.exports = router;
