const express = require('express');
const router = express.Router();
const {createCategory, getAllCategories} = require('../controllers/categoryController');
const passport = require("../utils/passport-configs");

// Rota para criar categoria
router.post('/categories', passport.authenticate('jwt', { session: false }),createCategory);
router.get('/categories', getAllCategories )
module.exports = router;